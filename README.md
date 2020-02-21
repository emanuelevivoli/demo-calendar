# DemoCalendar

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.25.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## Using Docker

### Create Container

First create the Docker container with the following command:

`my-terminal$ docker build -t example:dev .`

### Run the Container

Second, run the container binding the internal (hidden) container port to the output (visible) port by doing:

`my-terminal$ docker run -p 4200:4321 --rm example:dev`

### Note

Of course you can change the container name, and the external port by changing:

- `example:dev` is the name;
- `4321` is the internal port (specified in the Dockerfile);
- `4200` is the visible port, you can choose any port you want;
