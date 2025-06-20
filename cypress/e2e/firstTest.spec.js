/// <reference types="cypress" />

// const { Dropdown } = require("bootstrap")
// const { using } = require("rxjs")

//describe() or context() for the beginning of the test suite

describe("First test suite", () => {

    beforeEach("login", () => {

        //repeat on every test
    })

it("First test", () => {

    cy.visit('/')
    cy.contains("Forms").click()
    cy.contains("Form Layouts").click()
    
    //By Tag name
    cy.get("input")

    // By ID
    cy.get("#inputEmail1")

    //By Class value
    cy.get(".input-full-width")

    // By Attribute name
    cy.get("[fullwidth]")

    //By Attribute and value
    cy.get("[placeholder='Email']")

    //By entire Class value
    cy.get('[class="input-full-width size-medium shape-rectangle"]')

    //By two Attributes
    cy.get('[placeholder="Email"][fullwidth]')

    //By tag, attribute, id and class
    cy.get('input[placeholder="Email"]#inputEmail1.input-full-width')

    //By cypress test id
    cy.get('[data-cy="imputEmail1"]')

})

it('Second test', () => {
    cy.visit('/')
    cy.contains("Forms").click()
    cy.contains("Form Layouts").click()


    //Theory
    // get() - find (all) elements on the page by locator globally
    // find() - find child elements by locator
    // contains() - find element bu HTML text and by text and locator

    cy.contains('Sign in')
    cy.contains('[status="warning"]', 'Sign in')
    cy.contains('nb-card', 'Horizontal form').find('button')

    
    // Cypress chains and DOM
    cy.get('#inputEmail3')
    .parents('form')
    .find('button')
    .should('contain', 'Sign in')
    .parents('form')
    .find('nb-checkbox')
    .click
})


it('Save subject of the command', () =>{
    cy.visit('/')
    cy.contains("Forms").click()
    cy.contains("Form Layouts").click()

    cy.contains('nb-card', 'Using the Grid').find('[for="inputEmail1"]').should('contain', 'Email')
    cy.contains('nb-card', 'Using the Grid').find('[for="inputPassword2"]').should('contain', 'Password')

   //THIS IS NOT GOOD SYNTAX FOR CYPRESS, IN CYPRESS YOU CAN'T DO THINGS LIKE THIS
    // const usingTheGrid = cy.contains('nb-card', 'Using the Grid')
    // usingTheGrid.find('[for="inputEmail1"]').should('contain', 'Email')
    // usingTheGrid.find('[for="inputPassword2"]').should('contain', 'Password') 

    //1. ALIAS - can be used globally, can be defined at the beginning and used afterwards
    cy.contains('nb-card', 'Using the Grid').as('usingTheGrid')
    cy.get('@usingTheGrid').find('[for="inputEmail1"]').should('contain', 'Email')
    cy.get('@usingTheGrid').find('[for="inputPassword2"]').should('contain', 'Password')

    //2. CYPRESS THEN() METHOD - usingTheGridForm can be used only inside the function, is not found anywhere else
    cy.contains('nb-card', 'Using the Grid').then( usingTheGridForm => {
        cy.wrap(usingTheGridForm).find('[for="inputEmail1"]').should('contain', 'Email')
         cy.wrap(usingTheGridForm).find('[for="inputPassword2"]').should('contain', 'Password')
    })
})



it('Extract text values', () => {
    cy.visit('/')
    cy.contains("Forms").click()
    cy.contains("Form Layouts").click()

    //1.
    cy.get('[for="exampleInputEmail1"]').should('contain', 'Email address')

    //2.
    cy.get('[for="exampleInputEmail1"]').then (label => {
        const labelText = label.text()
        expect(labelText).to.equal('Email address')
        cy.wrap(labelText).should('contain', 'Email address')
    })

    //3.
    cy.get('[for="exampleInputEmail1"]').invoke('text').then( text => {
        expect(text).to.equal('Email address')
    })
    cy.get('[for="exampleInputEmail1"]').invoke('text').as('labelText').should('contain', 'Email address')

    //4.
    cy.get('[for="exampleInputEmail1"]').invoke('attr', 'class').then (classValue => {
        expect(classValue).to.equal('label')
    })

    //5. Invoke proprety
    cy.get('#exampleInputEmail1').type('test@test.com')
    cy.get('#exampleInputEmail1').invoke('prop','value').should('contain', 'test@test.com').then( property => {
        expect(property).to.equal('test@test.com')
     })
})



it('Radio buttons', ()=> {
cy.visit('/')
cy.contains("Forms").click()
cy.contains("Form Layouts").click()

cy.contains('nb-card', 'Using the Grid').find('[type="radio"]').then( radioButtons => {
    cy.wrap(radioButtons).eq(0).check({force: true}).should('be.checked')
    cy.wrap(radioButtons).eq(1).check({force: true})
    cy.wrap(radioButtons).eq(0).should('not.be.checked')
    cy.wrap(radioButtons).eq(2).should('be.disabled')
})
})

it('Checkboxes', () => {
    cy.visit('/')
    cy.contains("Modal & Overlays").click()
    cy.contains("Toastr").click()
    cy.get('[type="checkbox"]').check({force: true})
    cy.get('[type="checkbox"]').uncheck({force: true})
     cy.get('[type="checkbox"]').eq(0).click({force: true})
     cy.get('[type="checkbox"]').eq(1).click({force: true})


})

it('Datepicker', () => {

    function selectDayFromCurrent(day) {
        let date = new Date()
        date.setDate(date.getDate() + day)
        let futureDate = date.getDate()
        let futureMonth = date.toLocaleDateString('en-Us', {month: 'short'})
        let futureYear = date.getFullYear()
        let dateToAssert = `${futureMonth} ${futureDate}, ${futureYear}`

        cy.get('nb-calendar-navigation').invoke('attr', 'ng-reflect-date').then( dateAttribute => {
            if (!dateAttribute.includes(futureMonth) || !dateAttribute.includes(futureYear)) {
            cy.get('[data-name="chevron-right"]').click()
            selectDayFromCurrent(day)
            } else {
            cy.get('.day-cell').not('.bounding-month').contains(futureDate).click()
            }
        })
        return dateToAssert

    }

    cy.visit('/')
    cy.contains("Forms").click()
    cy.contains("Datepicker").click()

    

    cy.contains('nb-card', 'Common Datepicker').find('input').then( input => {
        cy.wrap(input).click()
        const dateToAssert = selectDayFromCurrent(200)
        cy.wrap(input).invoke('prop', 'value').should('contain', dateToAssert)
        cy.wrap(input).should('have.value', dateToAssert)
    })

})

it('Lists and dropdowns', () => {
    cy.visit('/')

    //1.
    cy.get('nav nb-select').click()
    cy.get('.options-list').contains('Dark').click()
    cy.get('nav nb-select').should('contain', 'Dark')

    // 2. 
    cy.get('nav nb-select').then (dropDown => {
        cy.wrap(dropDown).click()
        cy.get('.options-list nb-option').each( (listItem, index) => {
            const itemText = listItem.text().trim()
            cy.wrap(listItem).click()
            cy.wrap(dropDown).should('contain', itemText)
            if (index < 3) {
                cy.wrap(dropDown).click()
            } 
        })
    })
})

it('Web tables', () => {
    cy.visit('/')
    cy.contains('Tables & Data').click()
    cy.contains('Smart Table').click()

    //1. Get the row by text
    cy.get('tbody').contains('tr', 'Larry').then (tableRow => {
        cy.wrap(tableRow).find('.nb-edit').click()
        cy.wrap(tableRow).find('[placeholder="Age"]').clear().type('35')
        cy.wrap(tableRow).find('.nb-checkmark').click()
        cy.wrap(tableRow).find('td').eq(6).should('contain', '35')
    })

    //2. Get row by index
    cy.get('thead').find('.nb-plus').click()
    cy.get('thead').find('tr').eq(2).then( tableRow => {
        cy.wrap(tableRow).find('[placeholder="First Name"]').type('John')
        cy.wrap(tableRow).find('[placeholder="Last Name"]').type('Doe')
        cy.wrap(tableRow).find('.nb-checkmark').click()
    })
    cy.get('tbody tr').first().find('td').then( tableColumns => {
        cy.wrap(tableColumns).eq(2).should('contain', 'John')
        cy.wrap(tableColumns).eq(3).should('contain', 'Doe')
    })

    //3. Get each row validation

    const age = [20, 30, 40, 200]
    cy.wrap(age).each(age => {
    cy.get('thead [placeholder="Age"]').clear().type(age)
    cy.wait(500)
    cy.get('tbody tr').each( tableRow => {
        if (age == 200) {
            cy.wrap(tableRow).should('contain', 'No data found')
        } else {
        cy.wrap(tableRow).find('td').eq('6').should('contain', age)
        }
        
    })
    })
})

it('Tooltips', () => {
    cy.visit('/')
    cy.contains('Modal & Overlays').click()
    cy.contains('Tooltip').click()

    cy.contains('nb-card','Colored Tooltips')
    .contains('Default').click()
    cy.get('nb-tooltip').should('contain', 'This is a tooltip')
})

it.only('Dialiog box test', () => {
    cy.visit('/')
    cy.contains('Tables & Data').click()
    cy.contains('Smart Table').click()

    //1. - This is not the best option, but it can be done like this too
    // cy.get('tbody tr').first().find('.nb-trash').click()
    // cy.on('window:confirm', (confirm) => {
    //     expect(confirm).to.equal('Are you sure you want to delete?') 
    // })

    //2. This is a better approach
    // const stub = cy.stub()
    // cy.on('window:confirm', stub)
    // cy.get('tbody tr').first().find('.nb-trash').click().then (() => {
    //     expect(stub.getCall(0)).to.be.calledWith('Are you sure you want to delete?')
    // })
    
    //3. - Select Cancel on the dialog box
    cy.get('tbody tr').first().find('.nb-trash').click()
    cy.on('window:confirm', () => false)
})

})
