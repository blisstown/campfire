import './app.css';
import App from './App.svelte';
import Instance from './instance.js';

const app = new App({
    target: document.getElementById('app')
});

export default app;
