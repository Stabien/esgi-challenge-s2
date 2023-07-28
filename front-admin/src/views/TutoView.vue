<template>
  <div class="w-[50%] mx-auto mb-8">
    <h1 class="text-palette-primary-500 font-bold text-4xl mb-8">
      How to install our beautiful package
    </h1>
    <div class="grid grid-cols-3 items-center gap-8">
      <h2>Step 1: Install the package using yarn:</h2>
      <img class="col-span-2" src="/install.png" alt="install" srcset="" />
      <h2>
        Step 2: Import and use the "tracker-vite" package in the main.js file of your Vue
        application:
      </h2>
      <img class="col-span-2" src="/tuto.png" alt="install" srcset="" />
      <h3 class="col-span-3">
        In this code, we first import the "tracker-vite" package using import Tracker from
        'tracker-vite';. Make sure that the package has been installed in your project using yarn as
        mentioned in Step 1. Next, we add the Tracker plugin to your Vue application using
        app.use(Tracker, options);. Replace 'wq6yljUGIg' in the App_id option with the actual App_id
        you have received or generated. By following these steps, you have installed the
        "tracker-vite" package and added it as a plugin in your Vue application. The package will
        now be available to track events and perform analytics as per its functionality.
      </h3>
    </div>
  </div>
</template>
