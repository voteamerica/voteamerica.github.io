# How to contribute

Third-party patches are essential for keeping Vote America great. 
We want to keep it as easy as possible to contribute changes. 
There are a few guidelines that we need contributors to follow 
so that we can have a chance of keeping on top of things.

## Getting Started

- Join our [Slack team](https://carpool-vote.slack.com/)! It's the best way to keep up to date with the project.
Please [email us](slack@carpoolvote.com) if you would like to join.
- If you're new to GitHub and open-source, please familiarise yourself 
with the [official guidelines](https://guides.github.com/activities/contributing-to-open-source/).
- Check our GitHub issues to see what needs doing.
	- Read the full issue description and any discussion before beginning your work.
	- If the issue is unassigned, let us know if you want to take it, and we'll assign it you you.
	- If it is already assigned, then find a different issue.
- Please try to follow the existing code style:
	- 4 space indents
	- Double quotes on HTML attributes, single quotes for JS strings
	- HTML must be accessible and semantic
	- Cache your jQuery selectors if you're going to reuse them

## Making Changes

- Fork the repository on GitHub
- Create a feature branch from where you want to base your work.
- Make commits of logical units.
- Check for unnecessary whitespace with `git diff --check` before committing.
- Make sure your [commit messages](https://github.com/erlang/otp/wiki/writing-good-commit-messages) 
clearly describe your change, are clear and concise, and are written in 
the imperative (e.g. 'Update rider email input field').
- Push your changes to a topic branch in your fork of the repository.
- Submit a pull request to this repository.

## Reviewing and testing PRs

- Once you have submitted a new PR, it will need to be reviewed and ideally tested before it's merged into master.
- Please indicate in your PR description whether your PR is ready to merge, or whether you're still working on it.
- Even if you have write permission to this repository, please try to avoid merging your own PRs, especially for large features.
- Ideally, every PR should have a senior project member sign off on it before being merged.
- If you have an urgent PR, please announce it in the #frontend Slack channel and one of us will try to prioritise reviewing and deploying it.