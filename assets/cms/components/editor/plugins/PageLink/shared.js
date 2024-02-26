import {createCommand} from "lexical";

export const INSERT_PAGE_LINK_COMMAND = createCommand('INSERT_PAGE_LINK_COMMAND')
export const REMOVE_PAGE_LINK_COMMAND = createCommand('REMOVE_PAGE_LINK_COMMAND')

export async function loadPage(id) {
    return (await fetch('/ccm/api/page/' + id)).json()
}