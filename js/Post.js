class Post {
    post_id = "";
    post_content = "";
    user_id = "";
    likes = "";
    api_url ='https://659c3020d565feee2dac9c63.mockapi.io';

   
    async create() {
        let session = new Session();
        let user_id = session.getSession();

        let data = {
            content: this.post_content,
            user_id: user_id,
            likes: 0
        }

        data = JSON.stringify(data);

        let response = await fetch(this.api_url + '/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data,
        })
           data = await response.json()
            return data;
    }

    async getAllPosts() {
        let response = await fetch(this.api_url + '/posts');
        let data = await response.json();
        return data;
    }

    like(post_id, likes) {
        let data = {
            likes: likes
        }

        data = JSON.stringify(data);

        fetch(this.api_url + '/posts/' + post_id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data,
        })
        .then(response => response.json())
        .then(data => {
        
        })
    }

    delete(post_id) {
        fetch(this.api_url + '/posts/' + post_id, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            alert('post obrisan');
        })
    }
}