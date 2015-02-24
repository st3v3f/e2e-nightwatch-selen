module.exports = {
  "Demo test Google" : function (browser) {
    browser
      .url("http://www.google.com")
      .waitForElementVisible('body', 1000)
      .assert.title('Google')
      //.setValue('input[type=text]', 'nightwatch')
      //.waitForElementVisible('button[name=btnG]', 1000)
      //.click('button[name=btnG]')
      //.pause(1000)
      //.assert.title('google')
      //.assert.containsText('#main', 'The Night Watch')
      //.verify.containsText('#main', 'This text not found and will fail')
      //.verify.containsText('#FAIL', 'Should fail as #FAIL not found .. and take screenshot')
      .end();
  }
};
