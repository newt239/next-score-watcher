import { describe, it, expect } from 'vitest'

import swedish10 from '@/utils/computeScore/swedish10'
import { AllGameProps, LogDBProps } from '@/utils/types'

describe('swedish10形式のスコア計算', () => {
  const mockGame: AllGameProps['swedish10'] = {
    id: 'test-game',
    name: 'テストゲーム',
    rule: 'swedish10' as const,
    players: [
      {
        id: 'player1',
        name: 'プレイヤー1',
        initial_correct: 0,
        initial_wrong: 0,
        base_correct_point: 1,
        base_wrong_point: 1,
      },
    ],
    quiz: { set_name: 'テストセット', offset: 0 },
    win_point: 10,
    lose_point: 10, // 失格ポイント
    win_through: 1,
    options: undefined,
  }

  it('初期状態で正しくスコアが計算される', async () => {
    const logs: LogDBProps[] = []
    const result = await swedish10(mockGame, logs)

    expect(result.scores[0]).toEqual({
      player_id: 'player1',
      player_name: 'プレイヤー1',
      score: 0,
      correct: 0,
      wrong: 0,
      last_correct: -1,
      last_wrong: -1,
      state: 'playing',
      text: '0 - 0',
      reach: false,
    })
  })

  it('正解時に正解数が正しく加算される', async () => {
    const logs: LogDBProps[] = [
      {
        id: 'log1',
        game_id: 'test-game',
        player_id: 'player1',
        variant: 'correct',
        system: false,
        timestamp: 1000,
        last_modified: 1000,
      },
    ]
    const result = await swedish10(mockGame, logs)

    expect(result.scores[0].correct).toBe(1)
    expect(result.scores[0].wrong).toBe(0)
    expect(result.scores[0].text).toBe('1 - 0')
    expect(result.scores[0].state).toBe('playing')
  })

  it('0-2問正解時の誤答は1失点', async () => {
    const logs: LogDBProps[] = [
      {
        id: 'log1',
        game_id: 'test-game',
        player_id: 'player1',
        variant: 'wrong',
        system: false,
        timestamp: 1000,
        last_modified: 1000,
      },
    ]
    const result = await swedish10(mockGame, logs)

    expect(result.scores[0].correct).toBe(0)
    expect(result.scores[0].wrong).toBe(1)
    expect(result.scores[0].text).toBe('0 - 1')
  })

  it('3-5問正解時の誤答は2失点', async () => {
    const logs: LogDBProps[] = [
      // 3問正解
      ...Array.from({ length: 3 }, (_, i) => ({
        id: `log${i + 1}`,
        game_id: 'test-game',
        player_id: 'player1',
        variant: 'correct' as const,
        system: false,
        timestamp: 1000 + i,
        last_modified: 1000 + i,
      })),
      // 1問誤答（2失点）
      {
        id: 'log4',
        game_id: 'test-game',
        player_id: 'player1',
        variant: 'wrong',
        system: false,
        timestamp: 1003,
        last_modified: 1003,
      },
    ]
    const result = await swedish10(mockGame, logs)

    expect(result.scores[0].correct).toBe(3)
    expect(result.scores[0].wrong).toBe(2) // 誤答時の失点は2
    expect(result.scores[0].text).toBe('3 - 2')
  })

  it('6問以上正解時の誤答は3失点', async () => {
    const logs: LogDBProps[] = [
      // 6問正解
      ...Array.from({ length: 6 }, (_, i) => ({
        id: `log${i + 1}`,
        game_id: 'test-game',
        player_id: 'player1',
        variant: 'correct' as const,
        system: false,
        timestamp: 1000 + i,
        last_modified: 1000 + i,
      })),
      // 1問誤答（3失点）
      {
        id: 'log7',
        game_id: 'test-game',
        player_id: 'player1',
        variant: 'wrong',
        system: false,
        timestamp: 1006,
        last_modified: 1006,
      },
    ]
    const result = await swedish10(mockGame, logs)

    expect(result.scores[0].correct).toBe(6)
    expect(result.scores[0].wrong).toBe(3) // 誤答時の失点は3
    expect(result.scores[0].text).toBe('6 - 3')
  })

  it('10問正解で勝ち抜け', async () => {
    const logs: LogDBProps[] = Array.from({ length: 10 }, (_, i) => ({
      id: `log${i + 1}`,
      game_id: 'test-game',
      player_id: 'player1',
      variant: 'correct' as const,
      system: false,
      timestamp: 1000 + i,
      last_modified: 1000 + i,
    }))
    const result = await swedish10(mockGame, logs)

    expect(result.scores[0].correct).toBe(10)
    expect(result.scores[0].state).toBe('win')
    expect(result.winPlayers).toContain('player1')
  })

  it('10失点で失格', async () => {
    const logs: LogDBProps[] = [
      // 3問正解して誤答のペナルティを2にする
      ...Array.from({ length: 3 }, (_, i) => ({
        id: `log${i + 1}`,
        game_id: 'test-game',
        player_id: 'player1',
        variant: 'correct' as const,
        system: false,
        timestamp: 1000 + i * 2,
        last_modified: 1000 + i * 2,
      })),
      // 5回誤答して10失点
      ...Array.from({ length: 5 }, (_, i) => ({
        id: `log${4 + i * 2}`,
        game_id: 'test-game',
        player_id: 'player1',
        variant: 'wrong' as const,
        system: false,
        timestamp: 1000 + (3 + i) * 2 + 1,
        last_modified: 1000 + (3 + i) * 2 + 1,
      })),
    ]
    const result = await swedish10(mockGame, logs)

    expect(result.scores[0].correct).toBe(3)
    expect(result.scores[0].wrong).toBe(10) // 5回 × 2失点 = 10失点
    expect(result.scores[0].state).toBe('lose')
  })
})