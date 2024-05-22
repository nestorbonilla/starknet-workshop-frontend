use starknet::ContractAddress;
use snforge_std::{declare, ContractClassTrait};
use workshop_frontend::IHelloStarknetDispatcher;
use workshop_frontend::IHelloStarknetDispatcherTrait;

#[test]
fn test_get_balance() {
    let contract = declare("HelloStarknet").unwrap();
    let (contract_address, _) = contract.deploy(@ArrayTrait::new()).unwrap();
    let dispatcher = IHelloStarknetDispatcher { contract_address};
    let balance = dispatcher.get_balance();
    assert(balance == 0, 'Balance should be 0');
    dispatcher.increase_balance(10);
    let changed_balance = dispatcher.get_balance();
    assert(changed_balance == 10, 'Balance should be 10');
}