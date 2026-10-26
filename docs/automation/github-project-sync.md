# GitHub project sync

The portfolio periodically checks public repositories owned by `syahmiaof`. A repository is included only when it has the `portfolio-showcase` topic and a valid `portfolio.json` at its root. Forks, archived repositories, and private repositories are ignored.

The sync updates a generated project-data file and copies the preview image into `public/images/github-projects/`. GitHub Actions runs the project-sync checks and opens or updates one draft pull request. The project reaches the live portfolio only after that pull request is reviewed and merged.

## Add a project

1. Add the `portfolio-showcase` topic in the repository's **About** settings.
2. Add a `portfolio.json` at the repository root, following [portfolio.json.example](./portfolio.json.example).
3. Put the preview image under the repository's `public/` directory and use its repository-relative path in the manifest. JPG, PNG, and WebP files up to 4 MB are supported.
4. Run the portfolio workflow manually, or wait for its scheduled scan. Review the draft pull request before merging.

For a project still being built, set `status` to `in-development` and provide `stage`, `scope`, `developmentNote`, and a live prototype URL. Only use claims and metrics that can be supported by the project.

## Enable pull request creation

In the portfolio repository, open **Settings → Actions → General → Workflow permissions** and enable **Allow GitHub Actions to create and approve pull requests**. The workflow uses only `contents: write` and `pull-requests: write` permissions, and the generated pull request still needs a human review and merge.

The workflow runs its own tests, lint, typecheck, and production build before creating a pull request. Since it uses `GITHUB_TOKEN`, GitHub does not start additional workflows from the resulting branch push. Merging the reviewed pull request into the default branch remains the normal deployment trigger.
