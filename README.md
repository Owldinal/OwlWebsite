# What is Owldinal?
![img](https://files.gitbook.com/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhD3qt540XUfaHqqze2al%2Fuploads%2FVFs2EN3uvGVIYC239c7b%2Fbanner.001.jpeg?alt=media&token=ef98a10e-358e-457a-b438-5b587cdc1805)
Owldinal, the inaugural on-chain game protocol on MerlinLayer2, seeks to weave new tales into the rich tapestry of the Merlin magical universe. By launching an inventive economic flywheel, it aims to extend the reach of Merlin's enchantment to an even broader audience.

# Game Mechanics
## Staking
### Staking `Owldinal`
Staking `Owl` PFPs allow you to get a blind box protection buff and a staking yield buff.
### Staking `Elf`
When `Elf` staked, the staker will get 25% rewards from the `magic fruit` staker, distributed evenly based on the amount of `magic fruit` staked. Once the staker claims the reward, 15% reward will be automatically burned.
### Staking `Magic Fruit`
When `magic fruit` staked, `$owl` will be distributed every 4 hours. Once the staker claims the reward, the staked `magic fruit` will be automatically unstake. Then 25% of the `$owl` will be stolen by staked `Elf`, leaving 75% available for the staker.
## Treasury Rewards
**_How Treasury Reward Release？_**
### For Magic Fruit
- The server conducts a staking settlement operation every 4 hours, with the staking settlement time set as (0, 4, 8, 12, 16, 20) in a round-trip cycle.
- Settlement occurs when each settlement time point is reached.
- Upon reaching the staking settlement time point, staking must have been maintained for a minimum of 4 hours for settlement to occur. For example: if I stake 1000 `Magic Fruits` at 00:01, since it has not been 4 hours by the time 4:00 is reached, there will be no rewards for this settlement. However, at 8:00 during the next settlement, since the staking duration of 1000 `Magic Fruits` has fulfilled the 4-hour requirement, rewards can be obtained. The reward amount varies slightly depending on the quantity of `Magic Fruits` staked at the time of settlement.
- Pool Allocation: Distribution occurs every 4 hours, with each distribution being a certain proportion of the current total pool (note that it is a certain proportion of the current pool, not the initial total pool), with the coefficient being `Y`, where `Y` is related to the quantity `X` of `Magic Fruits` staked.

| If X | Y |
| :-----| ----: |
X=1	|0.0001000%
1<X<=50	| 0.0050000%
50<X<=100 |	0.0100000%
100<X<=200	|0.0210000%
200<X<=400	|0.0430400%
400<X<=800	|0.0882300%
800<X<=1200	|0.1367600%
1200<X<=1800	|0.2119800%
1800<X<=2300	|0.2767500%
2300<X<=2800	|0.3429300%
2800<X<=3300	|0.4164100%
3300<X<=4000	|0.5224000%
4000<X<=5000	|0.6791300%
5000<X<=6000	|0.8421200%
6000<X<=7500	|1.1904800%
X>7500	|1.3492100%

### For `Elf`
- `Elf` staker earnings come from the claim action of `Magic Fruits` staker, thus settlements are real-time.
- When a `Magic Fruit` staker claims 10,000 `Owls`:
    - If he is not staked with an `Owl` NFT, 25% is snatched by the `elves`. 2,500 `Owls` are distributed among the `elves` currently staked. Assuming there are 100 `elves` staked, each `elf` receives 25 `Owls` as a reward.
    - If he is staked with an `Owl` NFT, 15% is snatched by the `elves`. 1,500 `Owls` are distributed among the `elves` currently staked. Assuming there are 100 `elves` staked, each `elf` receives 15 `Owls` as a reward.
- `Elves` staker can claim their earnings at any time, but upon claiming, they automatically unstake. During the claim:
    - If they are not staked with an `Owl` NFT, 15% is automatically burned, leaving only 85% to be claimed.
    - If they are staked with an `Owl` NFT, 10% is automatically burned, leaving only 90% to be claimed.

## The Magic of Owldinal
### Blind Box Protection Buff
- Owl's Protection, activated upon staking the first `owl`
    - 10% chance of obtaining an `Elf`
    - 89% chance of obtaining a `magic fruit`
    - 1% chance of failure, nothing obtained
### Staking Yield Buff
- Owl's Blessing, activated upon staking the second `owl`
    - When staker claims the reward of `Elf`, the automatic burn rate is reduced to 10%.
- Owl's Deterrence, activated upon staking the third `owl`
    - When the staker claims the reward of `magic fruit`, 15% will be stolen by `Elf`, and 85% will be received.
### Buff Activation Logic
- Staking one `owl` activates **Owl's Protection**.
- Staking two `owls` activates **Owl's Blessing**.
- Staking three `owls` activates **Owl's Deterrence**.
- Only when staking three owls simultaneously do all three buffs become active.
- If the number of staked `owls` drops from three to two, the third buff becomes inactive.
- If the number of staked `owls` drops from two to one, the second buff becomes inactive.
- Once a buff is activated, unstaking `owls` is only allowed after claiming rewards.
# Official Links
- Game: https://owldinal.xyz/treasury
- Doc: https://doc.owldinal.xyz/
- Audit Report: https://scalebit.xyz/reports/Owldinal-Final-Audit-Report.pdf
- X: https://x.com/Owldinal
