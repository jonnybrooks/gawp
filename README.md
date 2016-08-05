# gawp
Node module to monitor the filesystem and reload the browser on a per-project basis, 
without browser plugins or additional javascript.

## Install and run

<pre>
  npm install -g gawp
</pre>

Installing the package runs the monitor server as a background process, 
using the [forever](https://www.npmjs.com/package/forever) package. In future updates I plan on writing a script which creates
a scheduled task (on Windows) or a cronjob (on Linux) which initialises the server on startup - until then, initialising the server
has to be done manually after each restart, by running `gawp`.

## Why?

To provide a super simple way for web developers to add live reloading to their projects, on a per-project basis, 
without having to modify any of the server code. 

Other packages annoyed me because I didn't like:
* Unnecessary dependencies incurring overhead
* Learning esoteric syntax
* Having to manipulate the server code for trivialities like changing monitor target directories

I just wanted a simple, centralised way to monitor and reload multiple projects concurrently, with possiblities to extend
functionality later on (like building a nice beautiful front end for managing currently monitored projects).

## Useage

Useage is simple - all you have to do is add the project name and directory path to the projects object in `gawp.json`:

#### `gawp.json` (example setup)

<pre>
{
  "projects": {
    "myProjectName": "path/to/my/project",
    "someOtherProject": "path/to/a/different/one"
  }
}
</pre>

Then you just reference it in your HTML using a `<script>` tag with the following signature 
(making sure the `data-project` attribute matches one of the projects specified in `gawp.json`):

#### `index.html` (excerpt from `<head>`)

<pre>
&lt;script src="http://localhost:3000/gawp" data-project="myProjectName"&gt;&lt;/script&gt;
</pre>

If the projects object in `gawp.json` is empty, the server will fallback to a default configuration, where the project name
is "default" and the monitored path is the `public` folder in the package's root directory :)
