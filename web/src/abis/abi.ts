export const ABI = [
  {
    type: "impl",
    name: "HelloStarknetImpl",
    interface_name: "workshop_frontend::IHelloStarknet"
  },
  {
    type: "struct",
    name: "core::integer::u256",
    members: [
      { name: "low", type: "core::integer::u128" },
      { name: "high", type: "core::integer::u128" }
    ]
  },
  {
    type: "interface",
    name: "workshop_frontend::IHelloStarknet",
    items: [
      {
        type: "function",
        name: "increase_balance",
        inputs: [{ name: "amount", type: "core::integer::u256" }],
        outputs: [],
        state_mutability: "external"
      },
      {
        type: "function",
        name: "get_balance",
        inputs: [],
        outputs: [{ type: "core::integer::u256" }],
        state_mutability: "view"
      },
      {
        type: "function",
        name: "reset_balance",
        inputs: [],
        outputs: [],
        state_mutability: "external"
      }
    ]
  },
  {
    type: "event",
    name: "workshop_frontend::HelloStarknet::BalanceIncreased",
    kind: "struct",
    members: [
      {
        name: "sender",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key"
      },
      { name: "amount", type: "core::integer::u256", kind: "data" },
      { name: "new_balance", type: "core::integer::u256", kind: "data" }
    ]
  },
  {
    type: "event",
    name: "workshop_frontend::HelloStarknet::Event",
    kind: "enum",
    variants: [
      {
        name: "BalanceIncreased",
        type: "workshop_frontend::HelloStarknet::BalanceIncreased",
        kind: "nested"
      }
    ]
  }
] as const;