document.addEventListener('DOMContentLoaded', function () {
  setTimeout(async () => {
    console.log('====== test?');

    const swaggerTopbar = document.querySelector('.topbar');
    const swaggerUi = document.querySelector('div.swagger-ui');
    const swaggerContainer = document.querySelector('.swagger-container');

    // get the smee url from server
    const swaggerResponse = await fetch('/api/swagger');
    const swaggerBody = await swaggerResponse.json();
    const smeeUrl = swaggerBody.smeeUrl;
    const showSwaggerUi = swaggerBody.showSwaggerUi;
    const showSwaggerJson = swaggerBody.showSwaggerJson;
    const showAsyncDocs = swaggerBody.showAsyncDocs;
    const showSmeeClient = swaggerBody.showSmeeClient;
    const showNestjsDevTools = swaggerBody.showNestjsDevTools;


    const smeeIframe = document.createElement('iframe');
    smeeIframe.src = smeeUrl;
    smeeIframe.style.display = 'none';
    smeeIframe.style.width = '100%';
    smeeIframe.style.height = '100%';
    smeeIframe.style.border = 'none';
    smeeIframe.style.flexGrow = '1';

    if (showSmeeClient) {
      swaggerContainer.appendChild(smeeIframe);
    }

    const swaggerJsonIframe = document.createElement('iframe');
    swaggerJsonIframe.src = '/api/docs-json';
    swaggerJsonIframe.style.display = 'none';
    swaggerJsonIframe.style.width = '100%';
    swaggerJsonIframe.style.height = '100%';
    swaggerJsonIframe.style.border = 'none';
    swaggerJsonIframe.style.flexGrow = '1';

    if (showSwaggerJson) {
      swaggerContainer.appendChild(swaggerJsonIframe);
    }

    const asyncDocsIframe = document.createElement('iframe');
    asyncDocsIframe.src = '/api/docs-async';
    asyncDocsIframe.style.display = 'none';
    asyncDocsIframe.style.width = '100%';
    asyncDocsIframe.style.height = '100%';
    asyncDocsIframe.style.border = 'none';
    asyncDocsIframe.style.flexGrow = '1';

    if (showAsyncDocs) {
      swaggerContainer.appendChild(asyncDocsIframe);
    }

    const nestjsDevToolsIframe = document.createElement('iframe');
    nestjsDevToolsIframe.src = 'https://devtools.nestjs.com/';
    nestjsDevToolsIframe.style.display = 'none';
    nestjsDevToolsIframe.style.width = '100%';
    nestjsDevToolsIframe.style.height = '100%';
    nestjsDevToolsIframe.style.border = 'none';
    nestjsDevToolsIframe.style.flexGrow = '1';

    if (showNestjsDevTools) {
      swaggerContainer.appendChild(nestjsDevToolsIframe);
    }

    // add tabs under the topbar
    const tabs = document.createElement('div');
    // get active tab based on the current url
    const activeTab = getCurrentActiveTab();
    const allTabsHtml = [];

    if (showSwaggerUi) {
      allTabsHtml.push('<a id="swagger-ui">Swagger UI</a>');
    }

    if (showSwaggerJson) {
      allTabsHtml.push('<a id="json">Swagger JSON</a>');
    }

    if (showAsyncDocs) {
      allTabsHtml.push('<a id="async">Async Docs</a>');
    }

    if (showSmeeClient) {
      allTabsHtml.push('<a id="smee">Smee webhooks</a>');
    }

    if (showNestjsDevTools) {
      allTabsHtml.push('<a id="nestjs-devtools">NestJs DevTools</a>');

    }

    tabs.innerHTML = allTabsHtml.join('');
    tabs.classList.add('kb-tabs');

    tabs.addEventListener('click', setActiveTab);

    setActiveTab();

    swaggerTopbar.appendChild(tabs);

    function setActiveTab(event) {
      event = event || getCurrentActiveTab();
      const tab = event.target.id;

      // remove active class from all tabs
      tabs.querySelectorAll('a').forEach((tab) => {
        tab.classList.remove('active');
      });

      // add active class to the clicked tab
      event.target.classList.add('active');

      if (tab === 'swagger-ui') {
        swaggerUi.style.display = 'block';
        smeeIframe.style.display = 'none';
        swaggerJsonIframe.style.display = 'none';
        asyncDocsIframe.style.display = 'none';
        nestjsDevToolsIframe.style.display = 'none';
      } else if (tab === 'json') {
        swaggerUi.style.display = 'none';
        smeeIframe.style.display = 'none';
        swaggerJsonIframe.style.display = 'block';
        asyncDocsIframe.style.display = 'none';
        nestjsDevToolsIframe.style.display = 'none';
      } else if (tab === 'async') {
        swaggerUi.style.display = 'none';
        smeeIframe.style.display = 'none';
        swaggerJsonIframe.style.display = 'none';
        asyncDocsIframe.style.display = 'block';
        nestjsDevToolsIframe.style.display = 'none';
      } else if (tab === 'smee') {
        swaggerUi.style.display = 'none';
        smeeIframe.style.display = 'block';
        swaggerJsonIframe.style.display = 'none';
        asyncDocsIframe.style.display = 'none';
        nestjsDevToolsIframe.style.display = 'none';
      } else if (tab === 'nestjs-devtools') {
        swaggerUi.style.display = 'none';
        smeeIframe.style.display = 'none';
        swaggerJsonIframe.style.display = 'none';
        asyncDocsIframe.style.display = 'none';
        nestjsDevToolsIframe.style.display = 'block';
        // open a new tab to nestjs devtools
        window.open('https://devtools.nestjs.com/', '_blank');
      }
    }

    function getCurrentActiveTab() {
      const pathname = window.location.pathname;
      const hostname = window.location.hostname;
    
      if (pathname.endsWith('json')) {
        return { target: tabs.querySelector('#json') };
      }
    
      if (pathname.endsWith('async')) {
        return { target: tabs.querySelector('#async') };
      }
    
      // check if using smee at smee.kibibit.io
      if (hostname === 'smee.kibibit.io') {
        return { target: tabs.querySelector('#smee') };
      }

      if (hostname === 'devtools.nestjs.com') {
        return { target: tabs.querySelector('#nestjs-devtools') };
      }
    
      return { target: tabs.querySelector('#swagger-ui') };
    }
  }, 750);
});