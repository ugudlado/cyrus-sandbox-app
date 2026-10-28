# cyrus-sandbox-app

A tiny Node HTTP app used only to test a self-hosted Cyrus. It is the one repository the test GitHub token may write to.

```sh
npm test     # node --test, no dependencies
npm start    # PORT=3000 by default
```

There is no CI on purpose: tests run locally and in Cyrus worktrees.

Delivered through the kittu-jobs hub
