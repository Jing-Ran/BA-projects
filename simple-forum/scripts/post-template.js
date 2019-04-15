(function ($, Handlebars) {
  console.log('post template');
  const singlePostPartial = Handlebars.compile($('#single-post-partial').html());

  // singlePost partial
  Handlebars.registerPartial('singlePost', singlePostPartial);

  // postAuthor inline helper
  // Handlebars.registerPartial('postAuthor', (userId, options) => {
  //   console.log(userId, options);
  //   const current = options.data.root.users.find(user => user.id === userId);
  //   return current.username;
  // });
  Handlebars.registerHelper('postAuthor', (userId, options) => {
    const filtered = options.data.root.users.filter(el => el !== null);
    // console.log(userId,filtered);
    const targetUser = filtered.find(user => user.id === userId);
    return `<p class="post__author">By ${targetUser.username}</p>`;
  });
  // postComments helper
  Handlebars.registerHelper('postComments', (id, options) => {
    const { comments } = options.data.root;
    const template = `
      <li class="comment">
        <i class="fas fa-share"></i>
        <p class="comment__content">
    `;

    const results = comments.map(c => {
      if (c.postId === id) {
        return `
          ${template}
          ${c.body}
          <span class="comment__author">By ${(c.email).toLowerCase()}</span>
          </p>
          </li>
        `;
      }
    }).join('');
    return results;
  });

  Handlebars.registerHelper('createPost', (context, options) => {
    // console.log(context, options);
    return options.fn(context);
  });

  // recentComment helper
  Handlebars.registerHelper('recentComment', (context, options) => {
    const n = context.length;
    const randomIndex = Math.floor(Math.random() * n);
    const randomComment = context[randomIndex];
    let data;

    if (options.data) {
      data = Handlebars.createFrame(options.data);
    }

    for (let i = 0; i < n; i++) {
      if (data) {
        data.email = randomComment.email.toLowerCase();
      }
    }

    return options.fn(randomComment, {data});
  });
  // postTitle helper
  Handlebars.registerHelper('postTitle', (context, postId) => {
    const post = context.find(c => c.id === postId);
    return post.title;
  });
  Handlebars.registerHelper('getDate', () => new Date().toISOString());

})(jQuery, Handlebars);