import { describe, it, expect } from 'vitest'
import nbyn from '@/utils/computeScore/nbyn'
import { AllGameProps, LogDBProps } from '@/utils/types'

describe('nbyn形式のスコア計算', () => {
  const mockGame: AllGameProps['nbyn'] = {
    id: 'test-game',
    name: 'テストゲーム',
    rule: 'nbyn' as const,
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
    win_point: 5, // 5 by 5 形式（25点で勝ち抜け）
    win_through: 1,
    options: undefined,
  }

  it('初期状態で正しくスコアが計算される', async () => {
    const logs: LogDBProps[] = []
    const result = await nbyn(mockGame, logs)

    expect(result.scores[0]).toEqual({
      player_id: 'player1',
      player_name: 'プレイヤー1',
      score: 0, // 0 * (5 - 0) = 0
      correct: 0,
      wrong: 0,
      last_correct: -1,
      last_wrong: -1,
      state: 'playing',
      text: '0',
      reach: false,
    })
  })

  it('正解時にスコアが正しく計算される（正解数 × (N - 誤答数)）', async () => {
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
    const result = await nbyn(mockGame, logs)

    expect(result.scores[0].score).toBe(5) // 1 * (5 - 0) = 5
    expect(result.scores[0].correct).toBe(1)
    expect(result.scores[0].wrong).toBe(0)
  })

  it('誤答時にスコアが正しく減少する', async () => {
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
    ]
    const result = await nbyn(mockGame, logs)

    expect(result.scores[0].score).toBe(4) // 1 * (5 - 1) = 4
    expect(result.scores[0].correct).toBe(1)
    expect(result.scores[0].wrong).toBe(1)
  })

  it('N²に達すると勝利状態になる', async () => {
    const logs: LogDBProps[] = Array.from({ length: 5 }, (_, i) => ({
      id: `log${i + 1}`,
      game_id: 'test-game',
      player_id: 'player1',
      variant: 'correct' as const,
      system: false,
      timestamp: 1000 + i,
      last_modified: 1000 + i,
    }))
    const result = await nbyn(mockGame, logs)

    expect(result.scores[0].score).toBe(25) // 5 * (5 - 0) = 25 = 5²
    expect(result.scores[0].correct).toBe(5)
    expect(result.scores[0].state).toBe('win')
    expect(result.winPlayers).toContain('player1')
  })

  it('スコアが0以下になると失格状態になる', async () => {
    const logs: LogDBProps[] = Array.from({ length: 6 }, (_, i) => ({
      id: `log${i + 1}`,
      game_id: 'test-game',
      player_id: 'player1',
      variant: 'wrong' as const,
      system: false,
      timestamp: 1000 + i,
      last_modified: 1000 + i,
    }))
    const result = await nbyn(mockGame, logs)

    expect(result.scores[0].score).toBe(0) // 0 * (5 - 6) = 0（負の場合は0にクリップ）
    expect(result.scores[0].wrong).toBe(6)
    expect(result.scores[0].state).toBe('lose')
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
        variant: 'correct',
        system: false,
        timestamp: 1001,
        last_modified: 1001,
      },
      {
        id: 'log3',
        game_id: 'test-game',
        player_id: 'player1',
        variant: 'wrong',
        system: false,
        timestamp: 1002,
        last_modified: 1002,
      },
      {
        id: 'log4',
        game_id: 'test-game',
        player_id: 'player1',
        variant: 'correct',
        system: false,
        timestamp: 1003,
        last_modified: 1003,
      },
    ]
    const result = await nbyn(mockGame, logs)

    expect(result.scores[0].score).toBe(12) // 3 * (5 - 1) = 12
    expect(result.scores[0].correct).toBe(3)
    expect(result.scores[0].wrong).toBe(1)
    expect(result.scores[0].state).toBe('playing')
  })
})