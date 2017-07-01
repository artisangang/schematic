import element from './element';

import table from './table';

export default class draw  {

    constructor(app) {       
        this.app = app;               
    }

    get(model) {
     
        let app = this.app;

        // loop throug the model
        for (let p = 0; p < model.length; p++) {

            // create unique id for the form element
            var formId = app.name + ' ' + model[p].title;
            var appIdentity = formId.slug();

            // get form fields from json
            var fields = model[p].data;

            var tbody = [];

            for (let iField = 0;  iField < fields.length; iField++) {

                var field = fields[iField];

                var trow = [field.name];

                if (field.type == 'text' || field.type == 'password' || field.type == 'file' || field.type == 'email') {
                    var text = new element('input', {
                        type:field.type, 
                        name: field.name, 
                        "data-param-type": field.param_type || 'form',
                        class:"element " + (field.param_type || 'form') + ""
                    }).get();
                    trow.push(text);
                }

                trow.push(field.description || '');
                trow.push(field.param_type || 'string');
                trow.push(field.data_type || 'string');

                tbody.push(trow);

            }

            // create form submit or try now button
            let button = new element('button', {type: 'button', class:'schematic-btn', onclick:'schematic.tryNow("'+app.name+'", "'+appIdentity+'")', 'data-target':appIdentity }).text('Try Now').get();

            // start creating table
            let t = new table();
            
            // table header created
            t.header(['Parameter', 'Value', 'Description', 'Parameter Type', 'Data Type']);
            
            // insert data into table body    
            t.tbody(tbody);

            // create table footer
            t.footer([{html: button, colSpan:5}], true);
            
            // get table element instance
            var tableDom =  t.get();
            
            // create span element to display request method in title bar
            var method = new element('span', {class:'method'}).text((model[p].method || 'get')).get();

            // create span element to display request path in title bar
            var action = new element('span', {class:'action'}).text((model[p].action || '/')).get();

            // create title bar
            var bar = new element('div', {class:'heading'}).text((model[p].title || '')).get();

            // insert method span element in bar
            bar.appendChild(method);

            // insert action span element in bar
            bar.appendChild(action);

            // create the main panel
            var d = new element('div', {class:'panel ' + (model[p].method || 'get') }).get();

 
            // insert bar init
            d.appendChild(bar);

            // create panel body
            var b = new element('div', {class: 'body collapsey'}).get();


            // create panel body container
            var container = new element('div', {class: 'body-content'}).get();

            // create form element
            var form = new element('form', {class: 'schematic-form', id: appIdentity, method:model[p].method || 'get'}).get();

            // insert previously created table in form
            form.appendChild(tableDom);

            // now insert form element in panel body container
            container.appendChild(form);

            // insert panel container in panel body
            b.appendChild(container);

            // insert the panel body in main panel section
            d.appendChild(b);   


            // finish, whole main panel section in application dom
                       
            app.selector.appendChild(d);
        }
    }

}