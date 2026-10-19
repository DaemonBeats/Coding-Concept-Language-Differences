(function() {
     var headings = document.querySelectorAll('#main > .inner > h2');

     Array.prototype.forEach.call(headings, function(heading) {
          var sectionName = heading.textContent.trim();

          if (sectionName === 'Summary + Combined Examples')
               return;

          var button = document.createElement('button');
          button.type = 'button';
          button.className = 'section-toggle';
          button.setAttribute('aria-expanded', 'true');
          button.title = 'Collapse ' + sectionName + ' section';

          while (heading.firstChild)
               button.appendChild(heading.firstChild);

          button.addEventListener('click', function() {
               var expanded = button.getAttribute('aria-expanded') === 'true';
               var content = heading.nextElementSibling;

               while (content && content.tagName !== 'H2') {
                    content.classList.add('collapsible-section-content');
                    content.hidden = expanded;
                    content = content.nextElementSibling;
               }

               button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
               button.title = (expanded ? 'Expand ' : 'Collapse ') + sectionName + ' section';
          });

          heading.appendChild(button);
     });
})();
