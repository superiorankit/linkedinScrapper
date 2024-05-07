try {
  const puppeteer = require('puppeteer');
  const dotenv = require('dotenv');

  //Configuring path of env file
  dotenv.config({ path: './config.env' });

  //Method to start Scrapping
  const start = async () => {
    console.log("Started...........")
    // Launching browser
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 40
    });
    // const browser = await puppeteer.launch();

    //Opening a new page
    const page = await browser.newPage();
    try {
      //Linkedin username or email
      let user = process.env.USER;

      //Linked passowrd
      let password = process.env.PASSWORD;

      let searchInput = 'education';
      let category = 'Companies';
      let country = "indonesia";
      let industry = "education";
      let companySize = "#companySize-C";

      let dataRequired = 5;

      //Visiting to the link
      await page.goto('https://www.linkedin.com/home', { waitUntil: 'networkidle0' });

      //Setting viewport of window
      await page.setViewport({ width: 1280, height: 1024 });

      //type username
      await page.type('#session_key', user);
      //type password
      await page.type('#session_password', password)

      //click submit button
      await page.click('button[type=submit]')

      //waits for complete page load
      await page.waitForNavigation();

      //Selector for search field
      await page.waitForSelector('.search-global-typeahead__input')
      await page.type('.search-global-typeahead__input', searchInput)
      await page.keyboard.press('Enter')

      await page.waitForNavigation();


      //Selector for getting list of category button
      await page.waitForSelector('#search-reusables__filters-bar button')
      const buttons = await page.$$('#search-reusables__filters-bar button')

      buttons.forEach(async (button) => {
        const text = await page.evaluate(element => element.textContent.trim(), button)
        if (text.toLowerCase() === category.toLowerCase())
          button.click();
      })

      //function for filtering data which return list of suggestions according to input
      const filter = async (option, placeholder, search) => {

        //Selector for filter button
        await page.waitForSelector(option)
        const filterButton = await page.$(option)
        filterButton.click();

        //Selector for filter search input
        await page.waitForSelector(`input[placeholder='${placeholder}']`)
        let input = await page.$(`input[placeholder='${placeholder}']`)
        await input.click();
        await input.type(search, { delay: 500 })

        //Getting id of suggestion box.
        let id = await page.evaluate((element) => element.getAttribute('aria-controls'), input)

        //Selector for suggestion box
        await page.waitForSelector(`#${id}`)
        let suggestionDiv = await page.$(`#${id}`);

        //Getting list of all suggestions according to input
        await page.waitForSelector('span span')
        //returning list
        return await suggestionDiv.$$('span span');
      }

      //Country Choice filter
      let li = await filter('#searchFilter_companyHqGeo', 'Add a location', country);
      //clicking top suggestion
      li[0].click();

      //Accessing apply button
      let button = await page.$$('.reusable-search-filters-buttons .artdeco-button')
      button[1].click();
      await page.waitForNavigation();

      //Industry Choice filter
      li = await filter('#searchFilter_industryCompanyVertical', 'Add an industry', industry);

      //Iterating each suggestion and matching with provided input
      li.forEach(async (el) => {
        let text = await page.evaluate((e) => e.innerText, el)
        if (text.toLowerCase() === industry.toLowerCase()) {
          el.click();
          return;
        }
      })

      //Accessing apply button
      button = await page.$$('.reusable-search-filters-buttons .artdeco-button')
      button[3].click();
      await page.waitForNavigation();

      //Company Size Choice filter
      await page.waitForSelector('#searchFilter_companySize')
      const size = await page.$('#searchFilter_companySize')
      size.click();

      //Clicking on provided size
      const sizeLi = await page.$(companySize);
      await sizeLi.click();

      //Accessing apply button
      button = await page.$$('.reusable-search-filters-buttons .artdeco-button')
      button[5].click();

      //This keep count of company data extracted
      let companyCount = 0;

      //Array which stores each extacted data
      const data = [];

      //Method for start searching each company link on a page
      const search = async () => {

        //Selector for getting list of companies
        await page.waitForSelector(".entity-result__title-text .app-aware-link")
        const list = await page.$$(".entity-result__title-text .app-aware-link")
        const length = list.length;

        //Iterating each company
        for (let i = 0; i < length; i++) {
          const a = list[i];

          //Extracting link of each company
          const link = await page.evaluate(el => el.href.trim(), a)

          //Creating a page for each company's about page
          const Aboutpage = await browser.newPage();

          try {
            //Stores extacted data of a company
            let singleData = {
            }

            //Url to visit about page of a company
            const url = `${link}about`;
            await Aboutpage.goto(url);

            //Selector for name of company
            await Aboutpage.waitForSelector(".ph5 .mt2 h1")
            const name = await Aboutpage.evaluate(() => document.querySelector(".ph5 .mt2 h1").innerHTML.trim());
            singleData.name = name;

            //Selector for getting list of headings of about section
            await Aboutpage.waitForSelector("dl dt")
            const keyList = await Aboutpage.$$('dl dt')

            for (let i = 0; i < keyList.length; i++) {

              //Extracting each head of about page(For giving key name in object)
              let key = await Aboutpage.evaluate((val) => val.innerText, keyList[i]);

              //Extracting the value of head(As value of key)
              let val = await Aboutpage.evaluate((val) => val.nextElementSibling.innerText, keyList[i]);

              //Creating a key-value pair in object
              singleData[key] = val;
            }

            //Adding new extracted data as object in main Array
            data.push(singleData);
            companyCount++;

            //Condition for restricting number of data to extract
            if (companyCount === dataRequired) {
              await Aboutpage.close();
              return;
            };
            await Aboutpage.close();
          }
          catch (err) {
            console.log(err)
            await Aboutpage.close();
          }
        }

      };



      //Loop untill all data extracted of each page or till number of data required
      while (true) {
        try {
          await page.waitForNavigation();
          //Invoking method for extracted each data on current page
          await search();

          //Selector for getting next button
          const next = await page.waitForSelector('button[aria-label="Next"]');

          //Checking of next button is disabled(if disabled means current page is last page)
          const disabled = await page.evaluate((tag) => tag.disabled, next)

          //Condition to check if current page is last page or to restrict number of data required
          //(if true then break loop)
          if (companyCount === dataRequired || disabled) break;
          await next.click();

        }
        catch (err) {
          console.log(err);
          break;
        }
      }

      //Method for converting extracted data in XLSX
      const convertToXLSX = () => {

        const XLSX = require('xlsx');

        // Convert the data to a worksheet
        const ws = XLSX.utils.json_to_sheet(data);

        // Create a workbook and add the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // Write the workbook to a file
        XLSX.writeFile(wb, 'data.xlsx', { bookType: 'xlsx' });
        console.log("done")

      }

      convertToXLSX();

      page.close();
      browser.close();

    } catch (error) {
      console.log(error);
      page.close();
      browser.close();
      start();
    }
  }

  start();
} catch (error) {
  console.log(error)
}
