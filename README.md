### Steps to get the application up and running on your local machine.

- Rename .env.sample to .env and update licence key and credentials
- Add `newrelic-infra.yml` to the `newrelic-infra` folder and add the licence key to it. `license_key:xyz`
- Make sure to install docker and run this command
  ```bash
   docker compose up --build
  ```
