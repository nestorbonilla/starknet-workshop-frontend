#[starknet::interface]
pub trait IHelloStarknet<TContractState> {
    fn increase_balance(ref self: TContractState, amount: u256);
    fn get_balance(self: @TContractState) -> u256;
    fn reset_balance(ref self: TContractState);
}

#[starknet::contract]
mod HelloStarknet {
    use starknet::ContractAddress;
    use starknet::get_caller_address;

    #[storage]
    struct Storage {
        balance: u256,
        owner: ContractAddress,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        BalanceIncreased: BalanceIncreased,
    }

    #[derive(Drop, starknet::Event)]
    struct BalanceIncreased {
        #[key]
        sender: ContractAddress,
        amount: u256,
        new_balance: u256,
    }

    #[constructor]
    fn constructor(ref self: ContractState, initial_owner: ContractAddress) {
        self.owner.write(initial_owner);
        self.balance.write(0);
    }

    #[abi(embed_v0)]
    impl HelloStarknetImpl of super::IHelloStarknet<ContractState> {
        fn increase_balance(ref self: ContractState, amount: u256) {
            assert(amount != 0, 'Amount cannot be 0');
            let new_balance = self.balance.read() + amount;
            self.balance.write(new_balance);
            
            self.emit(BalanceIncreased {
                sender: get_caller_address(),
                amount: amount,
                new_balance: new_balance,
            });
        }

        fn get_balance(self: @ContractState) -> u256 {
            self.balance.read()
        }

        fn reset_balance(ref self: ContractState) {
            let caller = get_caller_address();
            assert(caller == self.owner.read(), 'Only owner can reset balance');
            self.balance.write(0);
        }
    }
}