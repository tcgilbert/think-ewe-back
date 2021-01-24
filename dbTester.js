const jwt_decode = require('jwt-decode')
const db = require('./models')
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJ0ZXN0MkB0ZXN0LmNvbSIsIm5hbWUiOiJCb2JieSBCcm93biIsImlhdCI6MTYxMTI0MjM4MiwiZXhwIjoxNjExMjQ1OTgyfQ.sDvHJrx1Kx-yMmAfP5cp8mbgS_DEilQnacVSrYpag9U"
// db.user.create({
//     email: "blah@aol.com",
//     name: "Thomas"
// }).then((res) => {
//     console.log(res);
// })

// db.user.findOne({ where: {email: 'blah@aol.com'} })
// .then((res) => {
//     console.log(res);
// })

// async function update() {
//     const updatedUser = await db.user.update({
//         email: "new@new1.com"
//     }, {
//         where: {
//             id: 5
//         }
//     })
//     console.log(updatedUser);
// }

// const book_post1 = {
//     title: "BOoky Book",
//     authors: ['steve', 'bob'],
//     rating: 2,
//     blurb: "good boook man",
//     user_id: 50,
//     cover_url: "image1"
// }


// db.book_post.create(book_post1)


// update()