export class Auth {
    constructor(options) {
        this._baseUrl = options.baseUrl;
        this._headers = options.headers;
    }

    _getResponseData(response) {
        return response.then((res) => {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject(new Error(`Ошибка получения данных: ${res.status} ${res.statusText}`));
        })
    }

    register(email, password) {
        return this._getResponseData(fetch(`${this._baseUrl}/signup`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                "password": password,
                "email": email
            })
        }))
    }

    login(email, password) {
        return this._getResponseData(fetch(`${this._baseUrl}/signin`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                "password": password,
                "email": email
            })
        }))
    }

    checkToken(token) {
        return this._getResponseData(fetch(`${this._baseUrl}/users/me`, {
            method: 'GET',
            headers: {
                ...this._headers,
                "Authorization": `Bearer ${token}`
            }
        }))
    }
}

const auth = new Auth({
    baseUrl: 'https://api.alexey.students.nomoredomains.icu',
    headers: {
        'Content-Type': 'application/json'
    }
})

export default auth;
