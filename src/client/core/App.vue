<template lang="pug">
  v-app.app
    v-navigation-drawer(app)

    v-app-bar(app)

    v-content
      v-container(fluid)
        v-icon fas fa-ad
        router-view

    v-footer(app)
</template>
