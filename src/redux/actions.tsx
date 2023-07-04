function addPost(someValue: { text: any; id: any }){
    return{
        type: "SHOW_SOME_VALUE",
        payload: {text: someValue.text, id: someValue.id}
    }
}

export {addPost}