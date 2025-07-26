import { describe, it, expect } from 'vitest'

import normal from '@/utils/computeScore/normal'
import { AllGameProps, LogDBProps } from '@/utils/types'

describe('normal形式のスコア計算', () => {
  const mockGame: AllGameProps['normal'] = {
    id: 'test-game',
    name: 'テストゲーム',
    rule: 'normal' as const,
    players: [
      {
        id: 'player1',
        name: 'プレイヤー1',
        initial_correct: 0,
        initial_wrong: 0,
        base_correct_point: 10,
        base_wrong_point: -10,
      },
      {
        id: 'player2',
        name: 'プレイヤー2',
        initial_correct: 0,
        initial_wrong: 0,
        base_correct_point: 10,
        base_wrong_point: -10,
      },
    ],
    quiz: { set_name: 'テストセット', offset: 0 },
    correct_me: 10,
    wrong_me: -10,
    win_point: 50,
    lose_point: -30,
    win_through: 1,
    discord_webhook_url: '',
    options: undefined,
    editable: true,
    last_open: '2025-01-01T00:00:00.000Z',
  }

  it('初期状態で正しくスコアが計算される', async () => {
    const logs: LogDBProps[] = []
    const result = await normal(mockGame, logs)

    expect(result.scores).toHaveLength(2)
    expect(result.scores[0]).toMatchObject({
      player_id: 'player1',
      score: 0,
      correct: 0,
      wrong: 0,
      state: 'playing',
    })
    expect(result.winPlayers).toEqual([])
  })

  it('正解時にスコアが正しく加算される', async () => {
    const logs: LogDBProps[] = [
      {
        id: 'log1',
        game_id: 'test-game',
        player_id: 'player1',
        variant: 'correct',
        system: 0 as const,
        timestamp: '1000',
        available: 1 as const,
      },
    ]
    const result = await normal(mockGame, logs)

    expect(result.scores[0].score).toBe(10)
    expect(result.scores[0].correct).toBe(1)
    expect(result.scores[0].wrong).toBe(0)
    expect(result.scores[0].last_correct).toBe(0)
    expect(result.scores[0].state).toBe('playing')
  })

  it('誤答時にスコアが正しく減算される', async () => {
    const logs: LogDBProps[] = [
      {
        id: 'log1',
        game_id: 'test-game',
        player_id: 'player1',
        variant: 'wrong',
        system: 0 as const,
        timestamp: '1000',
        available: 1 as const,
      },
    ]
    const result = await normal(mockGame, logs)

    expect(result.scores[0].score).toBe(-10)
    expect(result.scores[0].correct).toBe(0)
    expect(result.scores[0].wrong).toBe(1)
    expect(result.scores[0].last_wrong).toBe(0)
    expect(result.scores[0].state).toBe('playing')
  })

  it('勝ち抜けポイントに達すると勝利状態になる', async () => {
    const logs: LogDBProps[] = Array.from({ length: 5 }, (_, i) => ({
      id: `log${i + 1}`,
      game_id: 'test-game',
      player_id: 'player1',
      variant: 'correct' as const,
      system: 0,
      timestamp: `${1000 + i}`,
      available: 1,
    }))
    const result = await normal(mockGame, logs)

    expect(result.scores[0].score).toBe(50)
    expect(result.scores[0].correct).toBe(5)
    expect(result.scores[0].state).toBe('win')
  })

  it('失格ポイントに達すると失格状態になる', async () => {
    const logs: LogDBProps[] = Array.from({ length: 3 }, (_, i) => ({
      id: `log${i + 1}`,
      game_id: 'test-game',
      player_id: 'player1',
      variant: 'wrong' as const,
      system: 0,
      timestamp: `${1000 + i}`,
      available: 1,
    }))
    const result = await normal(mockGame, logs)

    expect(result.scores[0].score).toBe(-30)
    expect(result.scores[0].wrong).toBe(3)
    expect(result.scores[0].state).toBe('lose')
  })

  it('リーチ状態が正しく判定される', async () => {
    const logs: LogDBProps[] = Array.from({ length: 4 }, (_, i) => ({
      id: `log${i + 1}`,
      game_id: 'test-game',
      player_id: 'player1',
      variant: 'correct' as const,
      system: 0,
      timestamp: `${1000 + i}`,
      available: 1,
    }))
    const result = await normal(mockGame, logs)

    expect(result.scores[0].score).toBe(40)
    expect(result.scores[0].reach_state).toBe('playing')
    expect(result.scores[0].state).toBe('playing')
  })

  it('複数プレイヤーの場合に正しく計算される', async () => {
    const logs: LogDBProps[] = [
      {
        id: 'log1',
        game_id: 'test-game',
        player_id: 'player1',
        variant: 'correct',
        system: 0,
        timestamp: '1000',
        available: 1,
      },
      {
        id: 'log2',
        game_id: 'test-game',
        player_id: 'player2',
        variant: 'wrong',
        system: 0,
        timestamp: '1001',
        available: 1,
      },
    ]
    const result = await normal(mockGame, logs)

    expect(result.scores[0].score).toBe(10)
    expect(result.scores[1].score).toBe(-10)
    expect(result.scores[0].state).toBe('playing')
    expect(result.scores[1].state).toBe('playing')
  })
})