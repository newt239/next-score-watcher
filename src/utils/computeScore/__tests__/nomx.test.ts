import { describe, it, expect } from 'vitest'

import nomx from '@/utils/computeScore/nomx'
import { AllGameProps, LogDBProps } from '@/utils/types'

describe('nomx形式のスコア計算', () => {
  const mockGame: AllGameProps['nomx'] = {
    id: 'test-game',
    name: 'テストゲーム',
    rule: 'nomx' as const,
    players: [
      {
        id: 'player1',
        name: 'プレイヤー1',
        initial_correct: 0,
        initial_wrong: 0,
        base_correct_point: 1,
        base_wrong_point: 1,
      },
      {
        id: 'player2',
        name: 'プレイヤー2',
        initial_correct: 0,
        initial_wrong: 0,
        base_correct_point: 1,
        base_wrong_point: 1,
      },
    ],
    quiz: { set_name: 'テストセット', offset: 0 },
    win_point: 7,
    lose_point: 3,
    win_through: 1,
    options: undefined,
  }

  it('初期状態で正しくスコアが計算される', async () => {
    const logs: LogDBProps[] = []
    const result = await nomx(mockGame, logs)

    expect(result.scores).toHaveLength(2)
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
    expect(result.winPlayers).toEqual([])
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
    const result = await nomx(mockGame, logs)

    expect(result.scores[0].correct).toBe(1)
    expect(result.scores[0].wrong).toBe(0)
    expect(result.scores[0].last_correct).toBe(0)
    expect(result.scores[0].text).toBe('1 - 0')
    expect(result.scores[0].state).toBe('playing')
  })

  it('誤答時に誤答数が正しく加算される', async () => {
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
    const result = await nomx(mockGame, logs)

    expect(result.scores[0].correct).toBe(0)
    expect(result.scores[0].wrong).toBe(1)
    expect(result.scores[0].last_wrong).toBe(0)
    expect(result.scores[0].text).toBe('0 - 1')
    expect(result.scores[0].state).toBe('playing')
  })

  it('勝ち抜けポイントに達すると勝利状態になる', async () => {
    const logs: LogDBProps[] = Array.from({ length: 7 }, (_, i) => ({
      id: `log${i + 1}`,
      game_id: 'test-game',
      player_id: 'player1',
      variant: 'correct' as const,
      system: false,
      timestamp: 1000 + i,
      last_modified: 1000 + i,
    }))
    const result = await nomx(mockGame, logs)

    expect(result.scores[0].correct).toBe(7)
    expect(result.scores[0].state).toBe('win')
    expect(result.winPlayers).toContain('player1')
  })

  it('失格ポイントに達すると失格状態になる', async () => {
    const logs: LogDBProps[] = Array.from({ length: 3 }, (_, i) => ({
      id: `log${i + 1}`,
      game_id: 'test-game',
      player_id: 'player1',
      variant: 'wrong' as const,
      system: false,
      timestamp: 1000 + i,
      last_modified: 1000 + i,
    }))
    const result = await nomx(mockGame, logs)

    expect(result.scores[0].wrong).toBe(3)
    expect(result.scores[0].state).toBe('lose')
  })

  it('リーチ状態が正しく判定される', async () => {
    const logs: LogDBProps[] = Array.from({ length: 6 }, (_, i) => ({
      id: `log${i + 1}`,
      game_id: 'test-game',
      player_id: 'player1',
      variant: 'correct' as const,
      system: false,
      timestamp: 1000 + i,
      last_modified: 1000 + i,
    }))
    const result = await nomx(mockGame, logs)

    expect(result.scores[0].correct).toBe(6)
    expect(result.scores[0].reach).toBe(true)
    expect(result.scores[0].state).toBe('playing')
  })

  it('正解と誤答が混在した場合に正しく計算される', async () => {
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
      {
        id: 'log2',
        game_id: 'test-game',
        player_id: 'player1',
        variant: 'wrong',
        system: false,
        timestamp: 1001,
        last_modified: 1001,
      },
      {
        id: 'log3',
        game_id: 'test-game',
        player_id: 'player1',
        variant: 'correct',
        system: false,
        timestamp: 1002,
        last_modified: 1002,
      },
    ]
    const result = await nomx(mockGame, logs)

    expect(result.scores[0].correct).toBe(2)
    expect(result.scores[0].wrong).toBe(1)
    expect(result.scores[0].text).toBe('2 - 1')
    expect(result.scores[0].state).toBe('playing')
  })
})