export default function fetcher(url: string): any {
    return fetch(url).then(res => res.json())
}