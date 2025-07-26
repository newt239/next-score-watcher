import { describe, it } from 'vitest'

import normal from '@/utils/computeScore/normal'
import { AllGameProps, LogDBProps } from '@/utils/types'

describe('出力形式確認', () => {
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
    ],
    quiz: { set_name: 'テストセット', offset: 0 },
    correct_me: 10,
    wrong_me: -10,
    win_point: 50,
    lose_point: -30,
    win_through: 1,
    options: undefined,
  }

  it('初期状態の出力形式を確認する', async () => {
    const logs: LogDBProps[] = []
    const result = await normal(mockGame, logs)
    
    console.log('初期状態:', JSON.stringify(result.scores[0], null, 2))
    console.log('winPlayers:', JSON.stringify(result.winPlayers, null, 2))
  })

  it('勝利時の出力形式を確認する', async () => {
    const logs: LogDBProps[] = Array.from({ length: 5 }, (_, i) => ({
      id: `log${i + 1}`,
      game_id: 'test-game',
      player_id: 'player1',
      variant: 'correct' as const,
      system: false,
      timestamp: 1000 + i,
      last_modified: 1000 + i,
    }))
    const result = await normal(mockGame, logs)
    
    console.log('勝利時:', JSON.stringify(result.scores[0], null, 2))
    console.log('winPlayers:', JSON.stringify(result.winPlayers, null, 2))
  })
})