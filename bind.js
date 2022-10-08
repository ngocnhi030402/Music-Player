const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

console.log(document.querySelector('#heading').innerText);

const app = (() => {
    // bien local
    const cars = ['Xe dap'];

    const root = $('#root');

    return {
        add(car){
            cars.push(car);
        },
        delete(index){
            cars.splice(index, 1);
        },
        render() {
            const html = cars.map(car => `
                <li>${car}</li>
            `)
            .join("");

            root.innerHTML = html;
        }
    }
}) ();

app.render();