> [!NOTE]  
> This is a work in progress and not useful without the backend, which will be released later.

# AI Writer
This is the frontend of a experimental AI assisted creative writing app. It uses the web component framework [Lit](https://lit.dev/), components from [Shoelace](https://shoelace.style), and [Tailwind CSS](https://tailwindcss.com). Tailwind doesn't really work well with the Shadow DOM of Lit, but I managed to work around the limitation.

The backend is implemented in [Windmill](https://www.windmill.dev/), because it allows me to write web services with in Javascript, Python and SQL in a low code environment without any boilerplate. The downside is, that I can't easily release it. If the app turns out to be useful, I probably will rewrite the backend in a more conventional way.

This is by no means a finished product. There's almost no error handling, and it's missing many quality of life features.

![Screenshot](https://github.com/user-attachments/assets/b3ba672c-dfac-4355-af75-46a3e3f6d620)
