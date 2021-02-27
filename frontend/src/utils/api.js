export class Api {
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

    /* профиль */
    getProfile() {
        const token = localStorage.getItem('token');
        return this._getResponseData(fetch(`${this._baseUrl}/users/me`, {
            method: 'GET',
            headers: {
                ...this._headers,
                "Authorization": `Bearer ${token}`
            },
        }))

    }

    saveProfile(data) {
        const token = localStorage.getItem('token');
        return this._getResponseData(fetch(`${this._baseUrl}/users/me`, {
            method: 'PATCH',
            headers: {
                ...this._headers,
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: data.name,
                about: data.about
            })
        }))
    }

    changePhoto(data) {
        const token = localStorage.getItem('token');
        return this._getResponseData(fetch(`${this._baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
                ...this._headers,
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                avatar: data.avatar
            })
        }))
    }

    /* карточки */
    getInitialCards() {
        const token = localStorage.getItem('token');
        return this._getResponseData(fetch(`${this._baseUrl}/cards`, {
            method: 'GET',
            headers: {
                ...this._headers,
                "Authorization": `Bearer ${token}`
            },
        }))
    }

    addCard(item) {
        const token = localStorage.getItem('token');
        return this._getResponseData(fetch(`${this._baseUrl}/cards`, {
            method: 'POST',
            headers: {
                ...this._headers,
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: item.name,
                link: item.link
            })
        }))
    }

    deleteCard(item) {
        const token = localStorage.getItem('token');
        return this._getResponseData(fetch(`${this._baseUrl}/cards/${item._id}`, {
            method: 'DELETE',
            headers: {
                ...this._headers,
                "Authorization": `Bearer ${token}`
            },
        }))
    }

    changeLikeCardStatus(item, like) {
        const token = localStorage.getItem('token');
        if (like) {
            return this._getResponseData(fetch(`${this._baseUrl}/cards/${item._id}/likes`, {
                method: 'PUT',
                headers: {
                    ...this._headers,
                    "Authorization": `Bearer ${token}`
                },
            }))
        } else {
            return this._getResponseData(fetch(`${this._baseUrl}/cards/${item._id}/likes`, {
                method: 'DELETE',
                headers: {
                    ...this._headers,
                    "Authorization": `Bearer ${token}`
                },
            }))
        }
    }

    /** загрузка начальных данных в одном блоке */
    getAllData() {
        return Promise.all([this.getProfile(), this.getInitialCards()]);
    }
}

const api = new Api({
    baseUrl: 'https://api.alexey.students.nomoredomains.icu',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
