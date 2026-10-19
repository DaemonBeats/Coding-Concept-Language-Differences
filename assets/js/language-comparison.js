(function() {
     var pages = {
          'Python': 'Python.html',
          'C#': 'C%23.html',
          'C++': 'cpp.html',
          'Java': 'Java.html'
     };
     var currentLanguage = document.querySelector('#main h1');
     var heading = Array.prototype.find.call(document.querySelectorAll('#main h2'), function(element) {
          return element.textContent.trim() === 'Summary + Combined Examples';
     });

     if (!currentLanguage || !pages[currentLanguage.textContent.trim()] || !heading)
          return;

     var codeBlock = heading.nextElementSibling;

     while (codeBlock && codeBlock.tagName !== 'PRE' && codeBlock.tagName !== 'H2')
          codeBlock = codeBlock.nextElementSibling;

     if (!codeBlock || codeBlock.tagName !== 'PRE' || !codeBlock.querySelector('code'))
          return;

     var exampleDescription = codeBlock.previousElementSibling;
     var controls = document.createElement('div');
     controls.className = 'language-comparison-controls';
     controls.setAttribute('role', 'group');
     controls.setAttribute('aria-label', 'Compare this example with another language');

     var label = document.createElement('p');
     label.textContent = 'Compare with:';
     controls.appendChild(label);

     var result = document.createElement('section');
     result.className = 'language-comparison-result';
     result.hidden = true;

     var columns = document.createElement('div');
     columns.className = 'language-comparison-columns';
     result.appendChild(columns);

     var currentColumn = document.createElement('div');
     currentColumn.className = 'language-comparison-column';
     columns.appendChild(currentColumn);

     var currentHeading = document.createElement('h3');
     currentHeading.textContent = currentLanguage.textContent.trim() + ' combined example';
     currentColumn.appendChild(currentHeading);

     var comparisonColumn = document.createElement('div');
     comparisonColumn.className = 'language-comparison-column';
     columns.appendChild(comparisonColumn);

     var resultHeading = document.createElement('h3');
     comparisonColumn.appendChild(resultHeading);

     var resultPre = document.createElement('pre');
     var resultCode = document.createElement('code');
     resultPre.appendChild(resultCode);
     comparisonColumn.appendChild(resultPre);

     var message = document.createElement('p');
     message.className = 'language-comparison-message';
     message.setAttribute('role', 'status');
     result.appendChild(message);

     var latestRequest = 0;

     Object.keys(pages).forEach(function(language) {
          if (language === currentLanguage.textContent.trim())
               return;

          var button = document.createElement('button');
          button.type = 'button';
          button.className = 'button small';
          button.textContent = language;
          button.setAttribute('aria-expanded', 'false');
          button.addEventListener('click', function() {
               var requestId = ++latestRequest;
               currentColumn.appendChild(codeBlock);
               result.hidden = false;
               resultHeading.textContent = language + ' combined example';
               resultCode.textContent = '';
               message.textContent = 'Loading example…';

               Array.prototype.forEach.call(controls.querySelectorAll('button'), function(compareButton) {
                    compareButton.setAttribute('aria-expanded', 'false');
               });
               button.setAttribute('aria-expanded', 'true');

               if (window.location.protocol === 'file:') {
                    message.textContent = 'To load another language, open this site through a local web server rather than directly from a file.';
                    return;
               }

               fetch(pages[language]).then(function(response) {
                    if (!response.ok)
                         throw new Error('Could not load ' + language + ' page (HTTP ' + response.status + ').');

                    return response.text();
               }).then(function(html) {
                    if (requestId !== latestRequest)
                         return;

                    var otherPage = new DOMParser().parseFromString(html, 'text/html');
                    var otherHeading = Array.prototype.find.call(otherPage.querySelectorAll('#main h2'), function(element) {
                         return element.textContent.trim() === 'Summary + Combined Examples';
                    });
                    var otherPre = otherHeading && otherHeading.nextElementSibling;

                    while (otherPre && otherPre.tagName !== 'PRE' && otherPre.tagName !== 'H2')
                         otherPre = otherPre.nextElementSibling;

                    var otherCode = otherPre && otherPre.querySelector('code');
                    if (!otherCode)
                         throw new Error('Could not find the combined example on the ' + language + ' page.');

                    Array.prototype.forEach.call(otherCode.childNodes, function(node) {
                         resultCode.appendChild(node.cloneNode(true));
                    });
                    message.textContent = '';
               }).catch(function(error) {
                    if (requestId === latestRequest)
                         message.textContent = error.message || 'Could not load the comparison example.';
               });
          });
          controls.appendChild(button);
     });

     exampleDescription.insertAdjacentElement('afterend', controls);
     controls.insertAdjacentElement('afterend', result);
})();
