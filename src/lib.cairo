#[starknet::interface]
pub trait IHelloStarknet<TContractState> {
    fn increase_balance(ref self: TContractState, amount: u256);
    fn get_balance(self: @TContractState) -> u256;
}

#[starknet::contract]
mod HelloStarknet {
    #[storage]
    struct Storage {
        balance: u256, 
    }

    #[abi(embed_v0)]
    impl HelloStarknetImpl of super::IHelloStarknet<ContractState> {
        fn increase_balance(ref self: ContractState, amount: u256) {
            assert(amount != 0, 'Amount cannot be 0');
            self.balance.write(self.balance.read() + amount);
        }

        fn get_balance(self: @ContractState) -> u256 {
            self.balance.read()
        }
    }
}
