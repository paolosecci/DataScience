def scrape():
        from bs4 import BeautifulSoup as bs
        import requests
        import time

        mars_data = {}

        #NASA MARS NEWS
        url = 'https://mars.nasa.gov/news/'
        reply = requests.get(url)
        soup = bs(reply.text, 'lxml')

        titles = []
        res = soup.find_all('div', class_='content_title')
        for re in res:
            title = re.find('a').text.strip('\n')
            titles.append(title)

        paras = []
        res2 = soup.find_all("div", class_='rollover_description_inner')
        for re in res2:
            para = re.text.strip('\n')
            paras.append(para)

        mars_feed = []
        for i in range(len(paras)):
            post = {
                'title': titles[i],
                'paragraph': paras[i]
            }
            mars_feed.append(post)

        mars_data['nasa_mars_feed'] = mars_feed



        from splinter import Browser
        from splinter.exceptions import ElementDoesNotExist

        !which chromedriver #for MAC
        executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
        browser = Browser('chrome', **executable_path, headless=False) ###DOES NOT WORK ON "USC GUEST WIRELESS"

        #NASA MARS IMGS
        url = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
        browser.visit(url)
        browser.click_link_by_partial_text('FULL IMAGE')

        html = browser.html
        soup = bs(html, 'html.parser')

        foto_html = soup.find('img', class_='fancybox-image')
        image_path = foto_html['src']
        featured_image_url = url + image_path

        mars_data['featured_img'] = featured_image_url



        #TWITTER MARS WEATHER
        url = 'https://twitter.com/marswxreport?lang=en'
        reply = requests.get(url)
        soup = bs(reply.text, 'lxml')

        latest_tweet = soup.find('p', class_='TweetTextSize TweetTextSize--normal js-tweet-text tweet-text').text
        mars_weather = latest_tweet

        #SPACE-FACTS MARS FACTS
        import pandas as pd
        url = 'http://space-facts.com/mars/'
        descriptions = []
        facts = []

        tables = pd.read_html(url)
        table = tables[0]
        for row in table:
            descriptions.append(row[0])
            facts.append(row[1])

        mars_facts_dict = {
            'description' = descriptions,
            'fact' = facts
        }

        mars_data['mars_facts_dict'] = mars_facts_dict



        #MARS HEMISPHERES DATA
        url = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
        hemispheres = []

        reply = requests.get(url)
        soup = bs(reply.text, 'lxml')
        res = soup.find_all('div', class_='description')
        for re in res:
            hemire = re.h3.text
            hemi = hemire.rsplit(' ', 1)[0] #remove "enhanced" from end of each string
            hemispheres.append(hemi)

        #MARS HEMISPHERES IMGS
        base_url = 'https://astrogeology.usgs.gov/search/map/Mars/Viking/'
        img_urls = []

        iterable_hemis = ['cerberus', 'schiaparelli', 'syrtis_major', 'valles_marineris']
        for hemi in iterable_hemis:
            url = base_url + hemi + '_enhanced'
            reply = requests.get(url)
            soup = bs(reply.text, 'lxml')
            html_img = soup.find('img', class_='wide-image')
            relative_path = html_img['src']
            img_url = url + relative_path
            img_urls.append(img_url)


        hemis_feed = []
        for i in range(len(hemispheres)):
            post = {
                'hemisphere': hemispheres[i],
                'img_url': img_urls[i]
            }
            hemis_feed.append(post)

        mars_data['hemisphere_data'] = hemis_feed



        return mars_data

#mars_data.hemisphere_data =>  list of dicitonaries{ .hemisphere, .img_url}
#mars_data.mars_facts      =>  dictionary of lists{.descriptions[], .facts[]}
#mars_data.featured_img    =>  string w url
#mars_data.nasa_mars_feed  =>  list of dictionaries{ .title, .paragraph}
