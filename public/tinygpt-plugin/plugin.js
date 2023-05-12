(async () => {
  tinymce.PluginManager.add("tinygpt", function(editor) {
    // write a function to generate an image from DALL-E 2 API given a certain prompt
    async function generateImage(prompt) {
      editor.setProgressState(true);
      console.log(`Generating image for prompt: ${prompt}`);
      const response = await fetch(`/api/image?prompt=${prompt}`);
      const data = await response.text();
      // document.getElementById('image-container').innerHTML = data;
      editor.setProgressState(false);
      return data;
    }

    // Function to generate a poem
    async function generatePoem(topic, style, wordCount) {
      const response = await fetch("/generate-poem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, style, wordCount }),
      });
      const data = await response.json();
      return data.poem;
    }

    // function to get content from our end point
    async function insertContent(topic, tokens) {
      try {
        editor.setProgressState(true);
        const response = await fetch("/generate-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, tokens }),
        });
        const data = await response.json();
        editor.setProgressState(false);
        editor.insertContent(`${data.content}`);
      } catch (error) {
        console.error(error);
        alert("Error generating content. Please try again later.");
      }
    }

    // Function to generate a summary
    async function generateSummary(content) {
      //to do: limit content to the first 5000 characters

      const response = await fetch("/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      return data.summary;
    }

    // Function to prompt the user for a blog topic
    function openInsertBlogDialog() {
      return editor.windowManager.open({
        title: "Insert Blog Post",
        body: {
          type: "panel",
          items: [
            {
              type: "textarea",
              name: "topic",
              label: "Prompt",
              placeholder: "Enter the topic of your post",
            },
            {
              type: "selectbox",
              name: "tone",
              label: "Tone",
              items: [
                { text: "Professional", value: "professional" },
                { text: "Conversational", value: "conversational" },
                { text: "Humorous", value: "humorous" },
                { text: "Empathic", value: "empathic" },
                { text: "Simple", value: "simple" },
                { text: "Academic", value: "academic" },
                { text: "Creative", value: "creative" },
              ],
            },
            {
              type: "input",
              name: "keywords",
              label: "Keywords",
              placeholder: "Enter keywords, separated by commas",
            },
            {
              type: "selectbox",
              name: "wordCount",
              label: "Word Count",
              items: [
                { text: "200", value: "200" },
                { text: "500", value: "500" },
                { text: "1,000", value: "1000" },
              ],
            },
          ],
        },
        buttons: [
          {
            type: "cancel",
            text: "Cancel",
          },
          {
            type: "submit",
            text: "Insert",
            primary: true,
          },
        ],
        onSubmit: async function(api) {
          const data = api.getData();
          api.close();
          insertContent(
            `Create a blog post about ${data.topic}. Write it in a ${data.tone} tone. Use transition words. Use active voice. Write ${data.wordCount} words. Add title and subtitle for each section. Keep each paragrah short. Include the following keywords: “${data.keywords}”. Use HTML to format headings, paragraphs, and lists. Use HTML to output the content, but only include the content between the <body> tags.`,
            2000
          );
        },
      });
    }

    // Function to prompt the user for a blog topic
    function openInsertJobDescriptionDialog() {
      return editor.windowManager.open({
        title: "Insert Job Description Post",
        body: {
          type: "panel",
          items: [
            {
              type: "textarea",
              name: "jobtitle",
              label: "Prompt",
              placeholder: "Enter the job title and any important information about the job.",
            },
            {
              type: "selectbox",
              name: "industry",
              label: "Industry",
              items: [
                { text: "Software", value: "Software" },
                { text: "Healthcare", value: "Healthcare" },
                { text: "Financial Services", value: "Financial Services" },
                { text: "Manufacturing", value: "Manufacturing" },
                { text: "Education", value: "Education" },
              ],
            },
          ],
        },
        buttons: [
          {
            type: "cancel",
            text: "Cancel",
          },
          {
            type: "submit",
            text: "Insert",
            primary: true,
          },
        ],
        onSubmit: async function(api) {
          const data = api.getData();
          api.close();
          insertContent(
            `Create a job description for a ${data.jobtitle} in the ${data.industry} industry. Use inclusive language and aim for a readiblity grade of 8. Do not use gender-biased other biased words. Use HTML to format headings, paragraphs, and lists. Use HTML to output the content, but only include the content between the <body> tags.`,
            500
          );
        },
      });
    }

    function openInsertPhotoDialog() {
      return editor.windowManager.open({
        title: "Insert Image",
        body: {
          type: "panel",
          items: [
            {
              type: "input",
              name: "imageprompt",
              label: "Prompt",
              placeholder: "Enter the image prompt",
            },
          ],
        },
      });
    }

    // a function to show a dialog that gets a prompt to generate an image
    function openInsertImageDialog() {
      return editor.windowManager.open({
        title: "Insert Image",
        body: {
          type: "panel",
          items: [
            {
              type: "textarea",
              name: "imageprompt",
              label: "Prompt",
              placeholder: "Enter the image prompt",
            },
            {
              type: "selectbox",
              name: "imagestyle",
              label: "Style",
              items: [
                { text: "", value: "" },
                { text: "3D Illustration", value: "3d illustration" },
                {
                  text: "Abstract Expressionism",
                  value: "abstract expressionism",
                },
                { text: "Anime", value: "anime" },
                { text: "Baroque", value: "baroque" },
                { text: "Blue Print", value: "blue print" },
                { text: "Cartoon", value: "cartoon" },
                {
                  text: "Children's Illustration",
                  value: "children's illustration",
                },
                { text: "Comic Book", value: "comic book" },
                { text: "Conceptual Art", value: "conceptual art" },
                { text: "Crayon Drawing", value: "crayon drawing" },
                { text: "Cubism", value: "cubism" },
                {
                  text: "Cyberpunk Illustration",
                  value: "cyberpunk illustration",
                },
                { text: "Digital Illustration", value: "digital illustration" },
                { text: "Emoji", value: "emoji" },
                { text: "Flat Art", value: "flat art" },
                { text: "Futurism", value: "futurism" },
                { text: "Geometric Drawing", value: "geometric drawing" },
                { text: "Graffiti", value: "graffiti" },
                { text: "Hyperrealism", value: "hyperrealism" },
                { text: "Impressionism", value: "impressionism" },
                { text: "Indigenous Art", value: "indigenous art" },
                { text: "Line Art", value: "line art" },
                { text: "Paper Collage", value: "paper collage" },
                { text: "Photorealism", value: "photorealism" },
                { text: "Pixar style 3D render", value: "pixar style 3D render" },
                { text: "Pop Art", value: "pop art" },
                { text: "Poster Art", value: "poster art" },
                { text: "Prehistoric Art", value: "prehistoric art" },
                { text: "Psychadelic Art", value: "psychadelic art" },
                { text: "Realism", value: "realism" },
                { text: "Retro", value: "retro" },
                { text: "Sculpture", value: "sculpture" },
                { text: "Surrealism", value: "surrealism" },
                { text: "Stock Image", value: "stock image" },
                { text: "Street Art", value: "street art" },
                { text: "Synthwave", value: "synthwave" },
                { text: "Tattoo Design", value: "tattoo design" },
                { text: "Vector Artwork", value: "vector artwork" },
                { text: "Vintage", value: "vintage" },
              ],
            },
            {
              type: "selectbox",
              name: "imageaesthetics",
              label: "Aesthetics",
              items: [
                { text: "", value: "" },
                {
                  text: "Abstract Expressionism",
                  value: "abstract expressionism",
                },
                { text: "Cyberpunk", value: "cyberpunk" },
                { text: "Steampunk", value: "steampunk" },
                { text: "Vaporwave", value: "vaporwave" },
              ],
            },
            {
              type: "selectbox",
              name: "imagecolors",
              label: "Colors",
              items: [
                { text: "", value: "" },
                { text: "Black and White", value: "black and white" },
                { text: "Placid", value: "placid" },
                { text: "Vibrant", value: "vibrant" },
              ],
            },
          ],
        },
        buttons: [
          {
            type: "cancel",
            text: "Cancel",
          },
          {
            type: "submit",
            text: "Insert",
            primary: true,
          },
        ],
        onSubmit: async function(api) {
          const data = api.getData();
          api.close();
          const imagePrompt = `${data.imageprompt} in the style of ${data.imagestyle}, ${data.imagecolors}, ${data.imageaesthetics}, 4k, high resolution, trending in artstation`;
          console.log(`Generating image for ${imagePrompt}`);
          const imageURL = await generateImage(imagePrompt);
          editor.insertContent(
            `<o><img src="${imageURL}" alt="${data.imageprompt}" /></p><p><em>${data.imageprompt} by DALL·E 2</em></p>`
          );
        },
      });
    }

    // Function to open the "Insert Poem" dialog
    function openInsertPoemDialog() {
      return editor.windowManager.open({
        title: "Insert Poem",
        body: {
          type: "panel",
          items: [
            {
              type: "textarea",
              name: "topic",
              label: "Prompt",
              placeholder: "Enter the topic of your poem",
            },
            {
              type: "selectbox",
              name: "style",
              label: "Style",
              items: [
                { text: "Banjo Paterson", value: "Banjo Paterson" },
                { text: "Bob Dylan", value: "Bob Dylan" },
                { text: "Eminem", value: "Eminem" },
                { text: "Gwen Harwood", value: "Gwen Harwood" },
                { text: "Henry Lawson", value: "Henry Lawson" },
                { text: "Judith Wright", value: "Judith Wright" },
                { text: "Paul McCartney", value: "Paul McCartney" },
                { text: "Oodgeroo Noonuccal", value: "Oodgeroo Noonuccal" },
                { text: "Rupert McCall", value: "Rupert McCall" },
              ],
            }
          ],
        },
        buttons: [
          {
            type: "cancel",
            text: "Cancel",
          },
          {
            type: "submit",
            text: "Insert",
            primary: true,
          },
        ],
        onSubmit: async function(api) {
          const data = api.getData();
          api.close();
          editor.setProgressState(true);
          try {
            const poem = await generatePoem(
              data.topic,
              data.style,
              200
            );
            editor.insertContent(`${poem}`);
          } catch (error) {
            console.error(error);
            alert("Error generating poem. Please try again later.");
          }
          editor.setProgressState(false);
        },
      });
    }

    // list of actions available to the slash command
    var insertActions = [
      {
        text: "Heading 1",
        icon: "h1",
        action: function() {
          editor.execCommand("mceInsertContent", false, "<h1>Heading 1</h1>");
          editor.selection.select(editor.selection.getNode());
        },
      },
      {
        text: "Heading 2",
        icon: "h2",
        action: function() {
          editor.execCommand("mceInsertContent", false, "<h2>Heading 2</h2>");
          editor.selection.select(editor.selection.getNode());
        },
      },
      {
        text: "Heading 3",
        icon: "h3",
        action: function() {
          editor.execCommand("mceInsertContent", false, "<h3>Heading 3</h3>");
          editor.selection.select(editor.selection.getNode());
        },
      },
      {
        type: "separator",
      },
      {
        text: "Bulleted list",
        icon: "unordered-list",
        action: function() {
          editor.execCommand("InsertUnorderedList", false);
        },
      },
      {
        text: "Numbered list",
        icon: "ordered-list",
        action: function() {
          editor.execCommand("InsertOrderedList", false);
        },
      },
      {
        text: "Insert Poem",
        icon: "ai-icon",
        action: async function() {
          editor.setProgressState(true);
          try {
            const poem = await generatePoem("TinyMCE", "Banjo Patterson", "50");
            editor.insertContent(`<p>${poem.replace(/\n/g, "<br>")}</p>`);
          } catch (error) {
            console.error(error);
            alert("Error generating poem. Please try again later.");
          }
          editor.setProgressState(false);
        },
      },
      {
        text: "Summarize",
        icon: "ai-icon",
        action: async function() {
          editor.setProgressState(true);
          try {
            const summary = await generateSummary(
              editor.getContent({ format: "text" })
            );
            editor.insertContent(`<p>${summary.replace(/\n/g, "<br>")}</p>`);
          } catch (error) {
            console.error(error);
            alert("Error generating summary. Please try again later.");
          }
          editor.setProgressState(false);
        },
      },
      {
        text: "Ask AI",
        icon: "ai-icon",
        action: async function() {
          //editor.dispatch('contexttoolbar-show', { toolbar: 'askAI-toolbar' });
          console.log("Ask AI!");
          editor.dispatch("contexttoolbar-show", {
            toolbarKey: "askAI-form",
          });
        },
      },
    ];

    // Register a custom SVG icon
    editor.ui.registry.addIcon(
      "ai-icon",
      '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M15.5 5L13 11 7 13.5 13 16 15.5 22 18 16 24 13.5 18 11 15.5 5zM4.125 7.875L5.5 12 6.875 7.875 11 6.5 6.875 5.125 5.5 1 4.125 5.125 0 6.5zM6.375 18.625L5.5 16 4.625 18.625 2 19.5 4.625 20.375 5.5 23 6.375 20.375 9 19.5z" fill="#0d152c"/></svg>'
    );
    // Register a custom SVG icon
    editor.ui.registry.addIcon(
      "ai-summary",
      '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M 4 3 C 2.9045455 3 2 3.9045455 2 5 L 2 19 C 2 20.095455 2.9045455 21 4 21 L 20 21 C 21.095455 21 22 20.095455 22 19 L 22 5 C 22 3.9069372 21.093063 3 20 3 L 4 3 z M 4 5 L 20 5 L 20 19 L 4 19 L 4 5 z M 6 7 L 6 9 L 10 9 L 10 7 L 6 7 z M 12 7 L 12 17 L 14 17 L 14 7 L 12 7 z M 16 7 L 16 9 L 18 9 L 18 7 L 16 7 z M 6 11 L 6 13 L 10 13 L 10 11 L 6 11 z M 16 11 L 16 13 L 18 13 L 18 11 L 16 11 z M 6 15 L 6 17 L 10 17 L 10 15 L 6 15 z M 16 15 L 16 17 L 18 17 L 18 15 L 16 15 z" fill="#0d152c"/></svg>'
    );
    editor.ui.registry.addIcon(
      "ai-blog",
      '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M 8 3 C 6.9069372 3 6 3.9069372 6 5 L 6 9 L 3 9 L 3 11 L 2 11 L 2 13 L 3 13 L 3 19 C 3 20.093063 3.9069372 21 5 21 L 19 21 C 20.093063 21 21 20.093063 21 19 L 21 13 L 22 13 L 22 11 L 21 11 L 21 9 L 18 9 L 18 5 C 18 3.9069372 17.093063 3 16 3 L 8 3 z M 8 5 L 16 5 L 16 9 L 14 9 L 14 11 L 15 11 L 15 13 L 9 13 L 9 11 L 10 11 L 10 9 L 8 9 L 8 5 z M 5 11 L 7 11 L 7 13 C 7 14.093063 7.9069372 15 9 15 L 15 15 C 16.093063 15 17 14.093063 17 13 L 17 11 L 19 11 L 19 19 L 5 19 L 5 11 z" fill="#0d152c"/></svg>'
    );


    // POEM FEATURE

    // Register a custom SVG icon
    editor.ui.registry.addIcon(
      "ai-poem",
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d152c"><path d="M 22 2 C 10.367 2 9.09 8.0225 9 10.1875 C 8.434 10.9765 7.90575 11.75325 7.46875 12.53125 C 7.379196 12.690457 7.3061593 12.843827 7.2207031 13 L 4 13 L 4 15 C 2.895 15 2 15.895 2 17 L 2 20 C 2 21.105 2.895 22 4 22 L 11 22 C 12.105 22 13 21.105 13 20 L 13 17 C 13 15.895 12.105 15 11 15 L 11 13 L 8.8144531 13 C 9.60723 11.625731 10.594174 10.222521 11.8125 8.90625 C 13.0465 7.69825 14.871 6.117 17 5 C 15.574 6.312 11.49975 9.977 10.34375 12 C 12.54675 12.457 16.207 11.043 18 9 C 17.582 8.953 15.578 8.496 15 8 C 16.109 8.09 18.266 8.051 19 8 C 20.043 7.125 21.375 4.328 22 2 z M 6 15 L 9 15 L 9 17 L 11 17 L 11 20 L 4 20 L 4 17 L 6 17 L 6 15 z" fill="#0d152c"/></svg>'
    );

    // Register the insertpoem button
    editor.ui.registry.addButton("insertpoem", {
      text: "Insert Poem",
      icon: "ai-poem", // Add the custom icon
      onAction: openInsertPoemDialog,
    });

    // Register the insert poem's menu button
    editor.ui.registry.addMenuButton("menuinsertpoem", {
      type: "menuitem",
      text: "Insert Poem",
      icon: "ai-poem", // Add the custom icon
      onAction: function(_) {
        openInsertPoemDialog();
      },
    });

    // Register the insert poem's menu item
    editor.ui.registry.addMenuItem("insertpoem", {
      text: "Poem",
      icon: "ai-poem", // Add the custom icon
      onAction: openInsertPoemDialog,
    });

    // JOB DESCRIPTION FEATURE

    // Register the insert job description's menu button
    editor.ui.registry.addMenuItem("insertjobdescription", {
      type: "menuitem",
      text: "Job Description",
      icon: "ai-icon", // Add the custom icon
      onAction: function(_) {
        openInsertJobDescriptionDialog();
      },
    });


    // Register the insert blog post's menu item
    editor.ui.registry.addMenuItem("insertblogpost", {
      text: "Blog Post",
      icon: "ai-blog", // Add the custom icon
      onAction: openInsertBlogDialog,
    });

    // Register the insert image's menu item
    editor.ui.registry.addMenuItem("insertaiimage", {
      text: "AI Image",
      icon: "image", // Add the custom icon
      onAction: openInsertImageDialog,
    });

    // Register the insert image's menu item
    editor.ui.registry.addMenuItem("insertsummary", {
      text: "Summary",
      icon: "ai-summary", // Add the custom icon
      onAction: async function() {
        editor.setProgressState(true);
        try {
          const summary = await generateSummary(
            editor.getContent({ format: "text" })
          );
          editor.insertContent(`<p>${summary.replace(/\n/g, "<br>")}</p>`);
        } catch (error) {
          console.error(error);
          alert("Error generating summary. Please try again later.");
        }
        editor.setProgressState(false);
      },
    });

    // Register the insert image's menu item
    editor.ui.registry.addMenuItem("insertsample", {
      text: "Sample Document",
      onAction: insertSampleContent,
    });

    // Formalize feature
    editor.ui.registry.addIcon(
      "ai-formalize",
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d152c"><path d="M 9 3 L 9 4 L 4 4 C 2.895 4 2 4.895 2 6 L 2 18 C 2 19.103 2.897 20 4 20 L 20 20 C 21.103 20 22 19.103 22 18 L 22 6 C 22 4.895 21.105 4 20 4 L 15 4 L 15 3 L 9 3 z M 4 6 L 20 6 L 20 13 L 18 13 A 1 1 0 0 0 17 12 A 1 1 0 0 0 16 13 L 8 13 A 1 1 0 0 0 7 12 A 1 1 0 0 0 6 13 L 4 13 L 4 6 z M 4 15 L 20 15 L 20 18 L 4 18 L 4 15 z" fill="#0d152c"/></svg>'
    );

    // Shortcut menu item to formalize content
    editor.ui.registry.addMenuItem("formalize", {
      text: "Formalize",
      icon: "ai-formalize",
      onAction: formalize,
    });

    function formalize() {
      // get the user's selected text, if any
      var selectedContent = tinymce.activeEditor.selection.getContent();
      console.log(selectedContent);
      tinymce.activeEditor.undoManager.transact(function() {
        insertContent(
          `Completely reword the following content to be more formal.  If there are HTML tags in the content, add HTML tags to the new content, and keep it similar to the original HTML. Only include heading tags such as <h2> if the original content included heading tags. \n\n${selectedContent}`,
          selectedContent.length / 3
        );
      });
    }

    // Shorten feature
    editor.ui.registry.addIcon(
      "ai-shorten",
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d152c"><path d="M 11 2 L 11 5 L 8 5 L 12 9 L 16 5 L 13 5 L 13 2 L 11 2 z M 12 9 L 3 9 L 3 11 L 21 11 L 21 9 L 12 9 z M 3 13 L 3 15 L 12 15 L 21 15 L 21 13 L 3 13 z M 12 15 L 8 19 L 11 19 L 11 22 L 13 22 L 13 19 L 16 19 L 12 15 z" fill="#0d152c"/></svg>'
    );

    // Shortcut menu item to formalize content
    editor.ui.registry.addMenuItem("shorten", {
      text: "Shorten",
      icon: "ai-shorten",
      onAction: shorten,
    });

    function shorten() {
      // get the user's selected text, if any
      var selectedContent = tinymce.activeEditor.selection.getContent();
      console.log(selectedContent);
      tinymce.activeEditor.undoManager.transact(function() {
        insertContent(
          `Rewrite the following content to be shorter. If there are HTML tags in the content, add HTML tags to the new content, and keep it similar to the original HTML. Only include heading tags such as <h2> if the original content included heading tags. \n\n${selectedContent}`,
          selectedContent.length / 3
        );
      });
    }

    // Expand feature
    editor.ui.registry.addIcon(
      "ai-expand",
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d152c"><path d="M 12 2 L 9 5 L 15 5 L 12 2 z M 3 7 L 3 9 L 21 9 L 21 7 L 3 7 z M 3 11 L 3 13 L 21 13 L 21 11 L 3 11 z M 3 15 L 3 17 L 21 17 L 21 15 L 3 15 z M 9 19 L 12 22 L 15 19 L 9 19 z" fill="#0d152c"/></svg>'
    );

    // Shortcut menu item to expand the content
    editor.ui.registry.addMenuItem("expand", {
      text: "Expand",
      icon: "ai-expand",
      onAction: expand,
    });

    function expand() {
      // get the user's selected text, if any
      var selectedContent = tinymce.activeEditor.selection.getContent();
      console.log(selectedContent);
      tinymce.activeEditor.undoManager.transact(function() {
        insertContent(
          `Rewrite the following content to be longer.  If there are HTML tags in the content, add HTML tags to the new content, and keep it similar to the original HTML. Only include heading tags such as <h2> if the original content included heading tags. \n\n${selectedContent}`,
          selectedContent.length / 3
        );
      });
    }


    // Rephrase feature

    editor.ui.registry.addIcon(
      "ai-rephrase",
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d152c"><path d="M 5 3 C 3.895 3 3 3.895 3 5 L 3 19 C 3 20.105 3.895 21 5 21 L 16.171875 21 L 14.171875 19 L 5 19 L 5 5 L 19 5 L 19 14.171875 L 21 16.171875 L 21 5 C 21 3.895 20.105 3 19 3 L 5 3 z M 7 7 L 7 9 L 17 9 L 17 7 L 7 7 z M 7 11 L 7 13 L 12 13 L 12 11 L 7 11 z M 15 15 L 15 17 L 20.146484 22.146484 L 22.146484 20.146484 L 17 15 L 15 15 z M 22.853516 20.853516 L 20.853516 22.853516 L 21.853516 23.853516 C 22.048516 24.048516 22.365547 24.048516 22.560547 23.853516 L 23.853516 22.560547 C 24.048516 22.364547 24.048516 22.048516 23.853516 21.853516 L 22.853516 20.853516 z" fill="#0d152c"/></svg>'
    );

    // Shortcut menu item to rephrase content
    editor.ui.registry.addMenuItem("rephrase", {
      text: "Rephrase",
      icon: "ai-rephrase",
      onAction: rephrase,
    });

    function rephrase() {
      // get the user's selected text, if any
      var selectedContent = tinymce.activeEditor.selection.getContent();
      console.log(selectedContent);
      tinymce.activeEditor.undoManager.transact(function() {
        insertContent(
          `Completely reword the following content. If there are HTML tags in the content, add HTML tags to the new content, and keep it similar to the original HTML. Only include heading tags such as <h2> if the original content included heading tags. \n\n${selectedContent}`,
          selectedContent.length / 5
        );
      });
    }


    // Translate feature

    editor.ui.registry.addIcon(
      "ai-translate",
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d152c"><path d="M 5 3 C 4.4777778 3 3.9453899 3.1913289 3.5683594 3.5683594 C 3.1913289 3.9453899 3 4.4777778 3 5 L 3 14 C 3 14.522222 3.1913289 15.05461 3.5683594 15.431641 C 3.9453899 15.808671 4.4777778 16 5 16 L 8 16 L 8 19 C 8 20.1 8.9 21 10 21 L 19 21 C 20.1 21 21 20.1 21 19 L 21 10 C 21 8.9 20.1 8 19 8 L 16 8 L 16 5 C 16 4.4777778 15.808671 3.9453899 15.431641 3.5683594 C 15.05461 3.1913289 14.522222 3 14 3 L 5 3 z M 20 3 L 18 5 L 20 7 L 20 3 z M 5 5 L 14 5 L 14 9 L 11 12 L 9 14 L 5 14 L 5 5 z M 11 12 L 11 11 C 10.724607 11 10.470976 10.974116 10.230469 10.933594 C 10.240464 10.926245 10.251769 10.92149 10.261719 10.914062 C 11.136726 10.260889 11.82349 9.2689736 11.96875 8 L 12 8 L 12 7.5 L 12 7 L 10 7 L 10 6 L 9 6 L 9 7 L 7 7 L 7 8 L 10.960938 8 C 10.829049 8.9270716 10.33606 9.6096966 9.6640625 10.111328 C 9.4647364 10.260121 9.2495926 10.390192 9.0253906 10.501953 C 8.3652679 10.106834 8 9.5371456 8 9 L 7 9 C 7 9.7194444 7.3357501 10.370308 7.8867188 10.886719 C 7.5801847 10.952772 7.2781426 11 7 11 L 7 12 C 7.6397853 12 8.328822 11.856535 8.9941406 11.595703 C 9.5784432 11.845526 10.252933 12 11 12 z M 14.099609 11.099609 L 15.400391 11.099609 L 17.900391 17.800781 L 16.400391 17.800781 L 16 16.400391 L 13.599609 16.400391 L 13.099609 17.800781 L 11.599609 17.800781 L 14.099609 11.099609 z M 14.800781 12.800781 L 13.900391 15.300781 L 15.599609 15.300781 L 14.800781 12.800781 z M 4 17 L 4 21 L 6 19 L 4 17 z" fill="#0d152c"/></svg>'
    );

    // Shortcut menu item to translate content
    editor.ui.registry.addMenuItem("translate", {
      text: "Translate to Spanish",
      icon: "ai-translate",
      onAction: translate,
    });

    function translate() {
      // get the user's selected text, if any
      var selectedContent = tinymce.activeEditor.selection.getContent();
      console.log(selectedContent);
      tinymce.activeEditor.undoManager.transact(function() {
        insertContent(
          `Translate the following content into Spanish. If there are HTML tags in the content, add HTML tags to the new content, and keep it similar to the original HTML. Only include heading tags such as <h2> if the original content included heading tags. \n\n${selectedContent}`,
          selectedContent.length / 5
        );
      });
    }

    // Fix spelling and grammar

    editor.ui.registry.addIcon(
      "ai-fix",
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d152c"><path d="M 20.292969 5.2929688 L 9 16.585938 L 4.7070312 12.292969 L 3.2929688 13.707031 L 9 19.414062 L 21.707031 6.7070312 L 20.292969 5.2929688 z" fill="#0d152c"/></svg>'
    );

    // Shortcut menu item to fix spelling and grammar content
    editor.ui.registry.addMenuItem("fix", {
      text: "Fix Spelling & Grammar",
      icon: "ai-fix",
      onAction: fix,
    });

    function fix() {
      // get the user's selected text, if any
      var selectedContent = tinymce.activeEditor.selection.getContent();
      console.log(selectedContent);
      tinymce.activeEditor.undoManager.transact(function() {
        insertContent(
          `Fix spelling and grammar in the following content. If there are HTML tags in the content, add HTML tags to the new content, and keep it similar to the original HTML. Only include heading tags such as <h2> if the original content included heading tags. \n\n${selectedContent}`,
          selectedContent.length / 5
        );
      });
    }

    function insertSampleContent() {
      editor.insertContent(
        '<h1 align="center">Chapter 1&nbsp;<br>The Approach to the Valley</h1><p>&nbsp;</p><hr><p>When I set out on the long excursion that finally led to California I wandered afoot and alone, from Indiana to the Gulf of Mexico, with a plant-press on my back, holding a generally southward course, like the birds when they are going from summer to winter. From the west coast of Florida I crossed the gulf to Cuba, enjoyed the rich tropical flora there for a few months, intending to go thence to the north end of South America, make my way through the woods to the headwaters of the Amazon, and float down that grand river to the ocean. But I was unable to find a ship bound for South America--fortunately perhaps, for I had incredibly little money for so long a trip and had not yet fully recovered from a fever caught in the Florida swamps. Therefore I decided to visit California for a year or two to see its wonderful flora and the famous Yosemite Valley. All the world was before me and every day was a holiday, so it did not seem important to which one of the world\'s wildernesses I first should wander.</p><p>Arriving by the Panama steamer, I stopped one day in San Francisco and then inquired for the nearest way out of town. "But where do you want to go?" asked the man to whom I had applied for this important information. "To any place that is wild," I said. This reply startled him. He seemed to fear I might be crazy and therefore the sooner I was out of town the better, so he directed me to the Oakland ferry.</p><p>So on the first of April, 1868, I set out afoot for Yosemite. It was the bloom-time of the year over the lowlands and coast ranges the landscapes of the Santa Clara Valley were fairly drenched with sunshine, all the air was quivering with the songs of the meadow-larks, and the hills were so covered with flowers that they seemed to be painted. Slow indeed was my progress through these glorious gardens, the first of the California flora I had seen. Cattle and cultivation were making few scars as yet, and I wandered enchanted in long wavering curves, knowing by my pocket map that Yosemite Valley lay to the east and that I should surely find it.</p><h3 align="center">The Sierra From The West</h3><p>Looking eastward from the summit of the Pacheco Pass one shining morning, a landscape was displayed that after all my wanderings still appears as the most beautiful I have ever beheld. At my feet lay the Great Central Valley of California, level and flowery, like a lake of pure sunshine, forty or fifty miles wide, five hundred miles long, one rich furred garden of yellow&nbsp;<em>Composit&oelig;</em>. And from the eastern boundary of this vast golden flower-bed rose the mighty Sierra, miles in height, and so gloriously colored and so radiant, it seemed not clothed with light, but wholly composed of it, like the wall of some celestial city. Along the top and extending a good way down, was a rich pearl-gray belt of snow; below it a belt of blue and lark purple, marking the extension of the forests; and stretching long the base of the range a broad belt of rose-purple; all these colors, from the blue sky to the yellow valley smoothly blending as they do in a rainbow, making a wall of light ineffably fine. Then it seemed to me that the Sierra should be called, not the Nevada or Snowy Range, but the Range of Light. And after ten years of wandering and wondering in the heart of it, rejoicing in its glorious floods of light, the white beams of the morning streaming through the passes, the noonday radiance on the crystal rocks, the flush of the alpenglow, and the irised spray of countless waterfalls, it still seems above all others the Range of Light.</p><p>In general views no mark of man is visible upon it, nor any thing to suggest the wonderful depth and grandeur of its sculpture. None of its magnificent forest-crowned ridges seems to rise mud above the general level to publish its wealth. No great valley or river is seen, or group of well-marked features of any kind standing out as distinct pictures. Even the summit peaks, marshaled in glorious array so high in the sky, seem comparatively regular in form. Nevertheless the whole range five hundred miles long is furrowed with ca&ntilde;ons 2000 to 5000 feet deep, in which once flowed majestic glaciers, and in which now flow and sing the bright rejoicing rivers.</p><h3 align="center">Characteristics Of The Ca&ntilde;ons</h3><p>Though of such stupendous depth, these ca&ntilde;ons are not gloom gorges, savage and inaccessible. With rough passages here and there they are flowery pathways conducting to the snowy, icy fountains; mountain streets full of life and light, graded and sculptured by the ancient glaciers, and presenting throughout all their course a rich variety of novel and attractive scenery--the most attractive that has yet been discovered in the mountain ranges of the world. In many places, especially in the middle region of the western flank, the main ca&ntilde;ons widen into spacious valleys or parks diversified like landscape gardens with meadows and groves and thickets of blooming bushes, while the lofty walls, infinitely varied in form are fringed with ferns, flowering plants, shrubs of many species and tall evergreens and oaks that find footholds on small benches and tables, all enlivened and made glorious with rejoicing stream that come chanting in chorus over the cliffs and through side ca&ntilde;ons in falls of every conceivable form, to join the river that flow in tranquil, shining beauty down the middle of each one of them.</p><h3 align="center">The Incomparable Yosemite</h3><p>The most famous and accessible of these ca&ntilde;on valleys, and also the one that presents their most striking and sublime features on the grandest scale, is the Yosemite, situated in the basin of the Merced River at an elevation of 4000 feet above the level of the sea. It is about seven miles long, half a mile to a mile wide, and nearly a mile deep in the solid granite flank of the range. The walls are made up of rocks, mountains in size, partly separated from each other by side ca&ntilde;ons, and they are so sheer in front, and so compactly and harmoniously arranged on a level floor, that the Valley, comprehensively seen, looks like an immense hall or temple lighted from above.</p><p>But no temple made with hands can compare with Yosemite. Every rock in its walls seems to glow with life. Some lean back in majestic repose; others, absolutely sheer or nearly so for thousands of feet, advance beyond their companions in thoughtful attitudes, giving welcome to storms and calms alike, seemingly aware, yet heedless, of everything going on about them. Awful in stern, immovable majesty, how softly these rocks are adorned, and how fine and reassuring the company they keep: their feet among beautiful groves and meadows, their brows in the sky, a thousand flowers leaning confidingly against their feet, bathed in floods of water, floods of light, while the snow and waterfalls, the winds and avalanches and clouds shine and sing and wreathe about them as the years go by, and myriads of small winged creatures birds, bees, butterflies--give glad animation and help to make all the air into music. Down through the middle of the Valley flows the crystal Merced, River of Mercy, peacefully quiet, reflecting lilies and trees and the onlooking rocks; things frail and fleeting and types of endurance meeting here and blending in countless forms, as if into this one mountain mansion Nature had gathered her choicest treasures, to draw her lovers into close and confiding communion with her.</p><h3 align="center">The Approach To The Valley</h3><p>Sauntering up the foothills to Yosemite by any of the old trails or roads in use before the railway was built from the town of Merced up the river to the boundary of Yosemite Park, richer and wilder become the forests and streams. At an elevation of 6000 feet above the level of the sea the silver firs are 200 feet high, with branches whorled around the colossal shafts in regular order, and every branch beautifully pinnate like a fern frond. The Douglas spruce, the yellow and sugar pines and brown-barked Libocedrus here reach their finest developments of beauty and grandeur. The majestic Sequoia is here, too, the king of conifers, the noblest of all the noble race. These colossal trees are as wonderful in fineness of beauty and proportion as in stature--an assemblage of conifers surpassing all that have ever yet been discovered in the forests of the world. Here indeed is the tree-lover\'s paradise; the woods, dry and wholesome, letting in the light in shimmering masses of half sunshine, half shade; the night air as well as the day air indescribably spicy and exhilarating; plushy fir-boughs for campers\' beds and cascades to sing us to sleep. On the highest ridges, over which these old Yosemite ways passed, the silver fir (<em>Abies magnifica</em>) forms the bulk of the woods, pressing forward in glorious array to the very brink of the Valley walls on both sides, and beyond the Valley to a height of from 8000 to 9000 feet above the level of the sea. Thus it appears that Yosemite, presenting such stupendous faces of bare granite, is nevertheless imbedded in magnificent forests, and the main species of pine, fir, spruce and libocedrus are also found in the Valley itself, but there are no "big trees" (<em>Sequoia gigantea</em>) in the Valley or about the rim of it. The nearest are about ten and twenty miles beyond the lower end of the valley on small tributaries of the Merced and Tuolumne Rivers.</p><h3 align="center">The First View: The Bridal Veil</h3><p>From the margin of these glorious forests the first general view of the Valley used to be gained--a revelation in landscape affairs that enriches one\'s life forever. Entering the Valley, gazing overwhelmed with the multitude of grand objects about us, perhaps the first to fix our attention will be the Bridal Veil, a beautiful waterfall on our right. Its brow, where it first leaps free from the cliff, is about 900 feet above us; and as it sways and sings in the wind, clad in gauzy, sun-sifted spray, half falling, half floating, it seems infinitely gentle and fine; but the hymns it sings tell the solemn fateful power hidden beneath its soft clothing.</p><p>The Bridal Veil shoots free from the upper edge of the cliff by the velocity the stream has acquired in descending a long slope above the head of the fall. Looking from the top of the rock-avalanche talus on the west side, about one hundred feet above the foot of the fall, the under surface of the water arch is seen to be finely grooved and striated; and the sky is seen through the arch between rock and water, making a novel and beautiful effect.</p><figure><img src="https://images.pexels.com/photos/415976/pexels-photo-415976.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"><figcaption>Bridal Veil Falls</figcaption></figure><p>Under ordinary weather conditions the fall strikes on flat-topped slabs, forming a kind of ledge about two-thirds of the way down from the top, and as the fall sways back and forth with great variety of motions among these flat-topped pillars, kissing and plashing notes as well as thunder-like detonations are produced, like those of the Yosemite Fall, though on a smaller scale.</p><p>The rainbows of the Veil, or rather the spray- and foam-bows, are superb, because the waters are dashed among angular blocks of granite at the foot, producing abundance of spray of the best quality for iris effects, and also for a luxuriant growth of grass and maiden-hair on the side of the talus, which lower down is planted with oak, laurel and willows.</p><h3 align="center">General Features Of The Valley</h3><p>On the other side of the Valley, almost immediately opposite the Bridal Veil, there is another fine fall, considerably wider than the Veil when the snow is melting fast and more than 1000 feet in height, measured from the brow of the cliff where it first springs out into the air to the head of the rocky talus on which it strikes and is broken up into ragged cascades. It is called the Ribbon Fall or Virgin\'s Tears. During the spring floods it is a magnificent object, but the suffocating blasts of spray that fill the recess in the wall which it occupies prevent a near approach. In autumn, however when its feeble current falls in a shower, it may then pass for tear with the sentimental onlooker fresh from a visit to the Bridal Veil.</p><p>Just beyond this glorious flood the El Capitan Rock, regarded by many as the most sublime feature of the Valley, is seen through the pine groves, standing forward beyond the general line of the wall in most imposing grandeur, a type of permanence. It is 3300 feet high, a plain, severely simple, glacier-sculptured face of granite, the end of one of the most compact and enduring of the mountain ridges, unrivaled in height and breadth and flawless strength.</p><figure><img src="https://images.pexels.com/photos/36363/pexels-photo.jpg?cs=srgb&amp;dl=california-cliff-cliffs-36363.jpg&amp;fm=jpg"><figcaption>Yosemite Valley</figcaption></figure><p>Across the Valley from here, next to the Bridal Veil, are the picturesque Cathedral Rocks, nearly 2700 feet high, making a noble display of fine yet massive sculpture. They are closely related to El Capitan, having been eroded from the same mountain ridge by the great Yosemite Glacier when the Valley was in process of formation.</p><p>Next to the Cathedral Rocks on the south side towers the Sentinel Rock to a height of more than 3000 feet, a telling monument of the glacial period.</p><p>Almost immediately opposite the Sentinel are the Three Brothers, an immense mountain mass with three gables fronting the Valley, one above another, the topmost gable nearly 4000 feet high. They were named for three brothers, sons of old Tenaya, the Yosemite chief, captured here during the Indian War, at the time of the discovery of the Valley in 1852.</p><p>Sauntering up the Valley through meadow and grove, in the company of these majestic rocks, which seem to follow us as we advance, gazing, admiring, looking for new wonders ahead where all about us is so wonderful, the thunder of the Yosemite Fall is heard, and when we arrive in front of the Sentinel Rock it is revealed in all its glory from base to summit, half a mile in height, and seeming to spring out into the Valley sunshine direct from the sky. But even this fall, perhaps the most wonderful of its kind in the world, cannot at first hold our attention, for now the wide upper portion of the Valley is displayed to view, with the finely modeled North Dome, the Royal Arches and Washington Column on our left; Glacier Point, with its massive, magnificent sculpture on the right; and in the middle, directly in front, looms Tissiack or Half Dome, the most beautiful and most sublime of all the wonderful Yosemite rocks, rising in serene majesty from flowery groves and meadows to a height of 4750 feet.</p>'
      );
    }

    // Register the button
    editor.ui.registry.addButton("summarize", {
      text: "Summarize",
      icon: "ai-summary", // Add the custom icon
      onAction: async function() {
        editor.setProgressState(true);
        try {
          const summary = await generateSummary(
            editor.getContent({ format: "text" })
          );
          editor.insertContent(`<p>${summary}</p>`);
        } catch (error) {
          console.error(error);
          alert("Error generating summary. Please try again later.");
        }
        editor.setProgressState(false);
      },
    });

    // Register the slash commands autocompleter
    editor.ui.registry.addAutocompleter("slashcommands", {
      ch: "/",
      minChars: 0,
      columns: 1,
      fetch: function(pattern) {
        const matchedActions = insertActions.filter(function(action) {
          return (
            action.type === "separator" ||
            action.text.toLowerCase().indexOf(pattern.toLowerCase()) !== -1
          );
        });

        return new Promise((resolve) => {
          var results = matchedActions.map(function(action) {
            return {
              meta: action,
              text: action.text,
              icon: action.icon,
              value: action.text,
              type: action.type,
            };
          });
          resolve(results);
        });
      },
      onAction: function(autocompleteApi, rng, action, meta) {
        editor.selection.setRng(rng);
        // Some actions don't delete the "slash", so we delete all the slash
        // command content before performing the action
        editor.execCommand("Delete");
        meta.action();
        autocompleteApi.hide();
      },
    });

    // Register the context toolbar
    editor.ui.registry.addContextForm("askAI-form", {
      launch: {
        type: "contextformtogglebutton",
        icon: "help",
      },
      label: "Ask AI",
      predicate: function(node) {
        // return node.nodeName === 'P';
        return false;
      },
      initValue: function() {
        return "";
      },
      commands: [
        {
          type: "contextformtogglebutton",
          icon: "unlink",
          tooltip: "Remove link",
          active: false,
          onAction: function(formApi) {
            console.log("Remove link clicked");
            formApi.hide();
          },
        },
      ],
      position: "selection",
      scope: "editor",
      onSubmit: function(formApi, value) {
        console.log("Submit clicked");
        formApi.hide();
      },
    });

    return {};
  });
})();
