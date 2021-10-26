import { writable } from "svelte/store"
import { browser } from "$app/env"

export const file = writable(browser && localStorage.getItem("file") || null)
file.subscribe((val) => {
    if (browser) return (localStorage.file = val)
})