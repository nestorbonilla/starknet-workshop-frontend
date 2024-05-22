# Starknet Frontend Workshop

Welcome to this workshop, where you'll learn how to build a frontend application using Starknet and Next.js together with the set of hooks available in Starknet-react.

## Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed Node.js (version 14 or later) and npm. You can download them [here](https://nodejs.org/en/download/).
* You have a basic understanding of Starknet Foundry if you'll deploy an instance.
* You have a basic understanding of JavaScript and React.

## Getting Started

### Starknet Foundry

This project includes a Starknet Foundry repository with a sample smart contract used in the frontend web app. To deploy your own instance of the contract, use `sncast` to [declare](https://foundry-rs.github.io/starknet-foundry/starknet/declare.html) changes (if any) and/or [deploy](https://foundry-rs.github.io/starknet-foundry/starknet/deploy.html) an instance.

### NextJS App

The `web` directory contains a Next.js app based on the  [starknet-react](https://github.com/apibara/starknet-react) template. To get started, open your terminal, navigate to the `web` directory and install dependencies.
```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```
I've updated libraries to ensure the latest versions are used. Once dependencies are updated, run the development server.
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000 with your browser to see the result.

## Workshop Steps

This workshop consists of five branches, each focusing on a specific step:

**Getting Started (branch: 0-getting-started)**: Setup the initial workshop structure.

Then, proceed with the following steps:

1. **Read Data (branch: 1-read-data)**: Retrieve the latest block number from the blockchain.
2. **Read Balance (branch: 2-read-balance)**: Retrieve your account balance.
3. **Read Contract (branch: 3-read-contract)**: Fetch data from a deployed smart contract.
4. **Write Contract (branch: 4-write-contract)**: Update the status of a smart contract.

At the end of the workshop, the `main` branch will include all changes made throughout the steps, serving as a complete reference for the workshop.

By following these steps, you'll gain hands-on experience building a frontend application with Starknet, Next.js, and StarknetReact.

## Troubleshooting

If you encounter any problems, check the [issues](https://github.com/nestorbonilla/starknet-workshop-frontend/issues) in this repository for a solution. If you don't find what you're looking for, feel free to open a new issue.

## Contributing to Starknet Frontend Workshop

To contribute to Starknet Frontend Workshop, follow these steps:

1. Fork this repository.
2. Clone your forked repository to your local machine.
3. Create a new branch with `git checkout -b <branch_name>`.
4. Make your changes and commit them with `git commit -m '<commit_message>'`.
5. Push your changes to your branch with `git push origin <branch_name>`.
6. Open a Pull Request to propose your changes to the original project.

Let's get started!