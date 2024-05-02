const puppeteer = require('puppeteer');


const start= async ()=>{

//     const context = await browser.createIncognitoBrowserContext();
// const page = await context.newPage();

    const browser = await puppeteer.launch({
        headless:false,
        defaultViewport:null
    });
    const page = await browser.newPage();

    await page.goto('https://www.linkedin.com/home', { waitUntil: 'networkidle0' });



    // const data = await page.evaluate(()=>document.getElementById('username').id);
    await page.type('#session_key','hagofor1@gmail.com');
    await page.type('#session_password','@7004741510Ank')

    await page.click('button[type=submit]')

    await page.waitForNavigation();

    await page.waitForSelector('.search-global-typeahead__input')

    await page.type('.search-global-typeahead__input','education')
    await page.keyboard.press('Enter')

    await page.waitForNavigation();

        await page.waitForSelector('#search-reusables__filters-bar')

        const nav = await page.$('#search-reusables__filters-bar')

        const buttons = await nav.$$('button')

        buttons.forEach(async (button)=>{
            const text = await page.evaluate(element => element.textContent.trim(),button)
            if(text === "Companies")
            button.click();
        })

        await page.waitForSelector('#searchFilter_companyHqGeo')
        const location = await page.$('#searchFilter_companyHqGeo')
        location.click();
        await page.waitForSelector("input[placeholder='Add a location']")
        let input = await page.$("input[placeholder='Add a location']")

         await input.click();
         await input.type('saudi',{delay: 500})

        let id = await page.evaluate((element)=>element.getAttribute('aria-controls'),input)
        
         await page.waitForSelector(`#${id}`)
        let locationDiv = await page.$(`#${id}`);

         await page.waitForSelector('span span')

        let li = await locationDiv.$('span span');         
          li.click();

          let button = await page.$$('.reusable-search-filters-buttons .artdeco-button')
          button[1].click();

// --------------------------------------------------------------------------------------------------------------

          await page.waitForNavigation();

          await page.waitForSelector('#searchFilter_industryCompanyVertical')

          await page.waitForSelector('#searchFilter_industryCompanyVertical')
          const industry = await page.$('#searchFilter_industryCompanyVertical')
          industry.click();
          await page.waitForSelector("input[placeholder='Add an industry']")
            input = await page.$("input[placeholder='Add an industry']")
  
           await input.click();
           await input.type('education',{delay: 500})
  
            id = await page.evaluate((element)=>element.getAttribute('aria-controls'),input)
          
           await page.waitForSelector(`#${id}`)
            locationDiv = await page.$(`#${id}`);
  
           await page.waitForSelector('span span')
  
            li = await locationDiv.$$('span span');    

            li.forEach(async (el)=>{
                let text = await page.evaluate((e)=>e.innerText,el)
                if(text.toLowerCase() === "education")
                {
                    el.click();
                    return;
                }
            })

            
          button = await page.$$('.reusable-search-filters-buttons .artdeco-button')
          button[3].click();

// --------------------------------------------------------------------------------------------------------------

await page.waitForNavigation();

await page.waitForSelector('#searchFilter_companySize')
const size = await page.$('#searchFilter_companySize')
size.click();


const sizeLi = await page.$('#companySize-C');

await sizeLi.click();

  
button = await page.$$('.reusable-search-filters-buttons .artdeco-button')
button[5].click();

// await page.waitForLoadState()
await page.waitForNavigation({ waitUntil: 'networkidle0' });
const next = await page.$('button[aria-label="Next"]');
console.log(next)





//------------------------------------------------------------------------------------------------------------------




const search = async () => {
  const obj = [];


          await page.waitForSelector(".entity-result__title-text .app-aware-link")
            //  const name = await page.$$eval(".entity-result__title-text .app-aware-link",(elements)=>elements.map((element)=> element.href))
            const list = await page.$$(".entity-result__title-text .app-aware-link")
            const length = list.length;
            for(let i=0;i<length;i++)
            {
              const a = list[i];
              const link = await page.evaluate(el => el.href.trim(),a)
              const Aboutpage = await browser.newPage();

              try{
      
                let singleObj = {
                }
             
              // Navigate the page to a URL
              const url = `${link}about`;
               await Aboutpage.goto(url);

               await Aboutpage.waitForSelector(".ph5 .mt2 h1")
               const name = await Aboutpage.evaluate(()=> document.querySelector(".ph5 .mt2 h1").innerHTML.trim());
               singleObj.name = name;
      
               await Aboutpage.waitForSelector("dl dt")
               const keyList = await Aboutpage.$$('dl dt')
               for(let i=0;i<keyList.length;i++)
               {
                  let key = await Aboutpage.evaluate((val)=>val.innerText,keyList[i]);

                  let val = await Aboutpage.evaluate((val)=>val.nextElementSibling.innerText,keyList[i]);

                  singleObj[key]=val;
               }
                  
               obj.push(singleObj);
              //  console.log(obj);
               await Aboutpage.close();
              }
              catch(err){
      
                console.log(" ")
                console.log(link)
                console.log(err)
              //   singleSearch(link);
              }
            }

 
};






while(true)
{
  try{
  // await search();
  const next = await page.$('button[aria-label="Next"]');
   console.log(next)
  await next.click();
  await page.waitForNavigation();
  }
  catch(err){
    console.log(err);
  }
}



 
search();




}






start();

