# ProjectDiscoveryApp

## Description

Assessment for ProjectDiscovery.io using Nx, React, TypeScript and Tailwind. There is dependency in Nx, so if you are prompted to install Nx CLI please do so using docs from [Nx Documentation](https://nx.dev).

## What I Learned in this Project

This was my first time using TanStack Table (https://tanstack.com/table/v8), ReactQuery, ReactVirtual and TailwindCSS. I am sure there are some better ways to do some things with these tools. I like what I was able to in a short time frame.

## Development server

Run `npx nx serve project-discovery-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Run using Nx Console

Install Nx Console to run the application using a GUI: https://nx.dev/core-features/integrate-with-editors#vscode.

## Understand this workspace

Run `npx nx graph` to see a diagram of the dependencies of the projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

## Assumptions and Decisions
- Tabs were not fully implemented since the design in Figma did not show all the expected functionality. I did not want to assume expected functionality.
- The color of the app displayed in prototype mode is different than the color shown in the design. I went with the colors in the design for the most parts. I was able to get some of the colors by looking at the components directly.
- The icon in the design for the "Open Jira" tag was not exporting correctly, so I used the icon from the main badge component in Figma. Some colors did not match either, so again I used the colors from the main badge component seen in Figma. I would have had a conversation with the designer if was on the team before making these decisions :).
- I assumed the Filters did not have to be fully implemented. Just styled.

### Libraries and Fonts Utilized
- Google Fonts: Inter
- TailwindCss
- Faker - For mock data
- React-Table - https://tanstack.com/table/v8
- React-Query
- React-Virtual





