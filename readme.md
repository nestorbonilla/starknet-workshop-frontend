# Starknet Frontend Workshop

This workshop teaches you how to build a Starknet frontend application using NextJS, StarknetJS v6, and Starknet-react hooks. It's designed for developers with basic React and TypeScript knowledge who want to learn Starknet frontend development.

## Prerequisites

Before you begin, ensure you have met the following requirements:

* Node.js (version 14 or later) and npm installed. Download them [here](https://nodejs.org/en/download/).
* Basic understanding of Starknet Foundry (if you want to deploy your own contract instance).
* Familiarity with TypeScript and React.

## Getting Started

### Starknet Foundry

This project includes a Starknet Foundry repository with a smart contract used in the frontend web app. The contract implements the following functionality:

- Increase balance: Add to the contract's balance (emits an event).
- Get balance: Retrieve the current balance.
- Reset balance: Set the balance to zero (owner-only function).

The contract also includes an owner field for access control and emits events for balance increases.

To deploy your own instance, use `sncast` to [declare](https://foundry-rs.github.io/starknet-foundry/starknet/declare.html) changes and/or [deploy](https://foundry-rs.github.io/starknet-foundry/starknet/deploy.html) an instance.

### NextJS App

The `web` directory contains a Next.js app based on the [starknet-react](https://github.com/apibara/starknet-react) template. Recent updates include:

- Compatibility with the latest versions of Starknet JS and Starknet-react.
- Upgrade to StarknetJS v6 (breaking changes from v5).
- Full TypeScript support for type-safe development.

To get started:

1. Navigate to the `web` directory
2. Copy `.env.template` to `.env.local` and fill in the required values
3. Install dependencies:
   ```bash
   npm install
   # or yarn, pnpm, bun
   ```
4. Run the development server:
   ```bash
   npm run dev
   # or yarn dev, pnpm dev, bun dev
   ```
5. Open http://localhost:3000 in your browser

## Workshop Steps

This workshop consists of seven branches, each focusing on a specific step:

**Getting Started (branch: 0-getting-started)**: Initial workshop structure setup.

Then, proceed with:

1. **Read Data (branch: 1-read-data)**: Retrieve the latest block number.
2. **Read Balance (branch: 2-read-balance)**: Fetch your account balance.
3. **Read Contract (branch: 3-read-contract)**: Get data from a deployed smart contract.
4. **Write Contract (branch: 4-write-contract)**: Update the smart contract's state.
5. **Reset Balance (branch: 5-reset-balance)**: Allow the owner to reset the counter balance.
6. **Get Events (branch: 6-get-events)**: Retrieve and display events from the smart contract.

The `main` branch will contain all changes, serving as a complete reference.

## Troubleshooting

If you encounter issues, check the [issues](https://github.com/nestorbonilla/starknet-workshop-frontend/issues) in this repository or open a new one if needed.

## Contributing

To contribute to this workshop:

1. Fork the repository.
2. Clone your fork locally.
3. Create a new branch (`git checkout -b feature/AmazingFeature`).
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
5. Push to the branch (`git push origin feature/AmazingFeature`).
6. Open a Pull Request.

Let's get started!
