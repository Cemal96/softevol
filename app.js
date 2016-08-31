// var customers = [
//   {
//     id: 1,
//     name: 'Oleh Aloshkin',
//     email: 'olegaleshkin@gmail.com',
//     phone: '+380632823381',
//     city: 'Kiev',
//     address: '22 Yangelya St., flat 512',
//     state: 'Kievskaya',
//     zip: '03056'
//   },
//   {
//     id: 2,
//     name: 'Max Bulgar',
//     email: 'maxbulgar@gmail.com',
//     phone: '+380681707096',
//     city: 'Kiev',
//     address: '22 Yangelya St., flat 512',
//     state: 'Kievskaya',
//     zip: '03056'
//   }
// ];

var App = React.createClass({
  render: function() {
    return(
      <div>
        <Header />
        <Customers />
      </div>
    );
  }
});

var Header = React.createClass({
  render: function() {
    return (
      <nav className="navbar navbar-static-top navbar-inverse">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Softevol</a>
        </div>
      </nav>
    );
  }
});

var Customers = React.createClass({
  getInitialState: function(){
    return {
      customers: []
    }
  },
  collectData: function(ref, el) {
    var model = {};
    for (var input of ref.getElementsByTagName(el)) {
      var type = input.getAttribute('data-type');
      model[type] = input.value;
    }
    return model;
  },
  customerCreate: function(model) {
    if (this.state.customers.length) {
      model.id = this.state.customers.length;
    } else {
      model.id = 1;
    }
    this.state.customers[model.id] = model;
    this.setState({
      customers: this.state.customers
    });
  },
  customerUpdate: function(model, ref, type) {
    var updated = this.collectData(ref, type);
    updated.id = model.id;
    this.state.customers[model.id] = updated;
    this.setState({
      customers: this.state.customers
    });
  },
  customerDelete: function(model) {
    this.setState({
      customers: this.state.customers.filter(function (customer) {
        return customer.id !== model.id;
      })
    });
  },
  render: function() {
    var table;
    var $this = this;
    var customers = this.state.customers.map(function(customer) {
      return (
        <Customer customer={customer} key={customer.id} customerUpdate={$this.customerUpdate} customerDelete={$this.customerDelete} />
      );
    });
    if (this.state.customers.length) {
      table = (
        <div className="table-responsive">
          <table className="table table-hover table-bordered table-striped">
            <thead>
            <tr>
              <th>
                <span>#</span>
              </th>
              <th>
                <span className="mid">Name</span>
              </th>
              <th>
                <span className="mid">Email</span>
              </th>
              <th>
                <span className="mid">Telephone</span>
              </th>
              <th>
                <span className="mid">City</span>
              </th>
              <th>
                <span className="mid">Address</span>
              </th>
              <th>
                <span className="mid">State</span>
              </th>
              <th>
                <span className="mid">ZIP</span>
              </th>
              <th>
                <span className="large">Manage</span>
              </th>
            </tr>
            </thead>
            {customers}
          </table>
        </div>
      );
    }
    return(
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              {table}
            </div>
            <div className="col-md-12 text-center">
              <button className="btn btn-primary text-center" data-toggle="modal" data-target="#add-customer" type="button">
                Create</button>
            </div>
          </div>
        </div>
        <Modal customerCreate={this.customerCreate} collectData={this.collectData} />
      </div>
    );
  }
});

var Customer = React.createClass({
  getInitialState: function(){
    return {
      edit: false
    }
  },
  toggleState: function(save) {
    if (this.state.edit) {
      this.setState({
        edit: false
      });
      if (save) {
        this.props.customerUpdate(this.props.customer, this.refs.updateRow, 'input');
      }
      return;
    }
    this.setState({
      edit: true
    });
  },
  render: function() {
    var customer;
    if (!this.state.edit) {
      customer = (
        <tr>
          <th>{this.props.customer.id}</th>
          <td>{this.props.customer.name}</td>
          <td>{this.props.customer.email}</td>
          <td>{this.props.customer.phone}</td>
          <td>{this.props.customer.city}</td>
          <td>{this.props.customer.address}</td>
          <td>{this.props.customer.state}</td>
          <td>{this.props.customer.zip}</td>
          <td>
            <div className="btn-group" role="group">
              <button onClick={() => this.toggleState(false)} className="btn btn-warning">Update</button>
              <button onClick={() => this.props.customerDelete(this.props.customer)} className="btn btn-danger">Delete</button>
            </div>
          </td>
        </tr>
      );
    } else {
      customer = (
        <tr ref="updateRow">
          <th>2</th>
          <td>
            <input type="text" data-type="name" defaultValue={this.props.customer.name} className="form-control" placeholder="Name" />
          </td>
          <td>
            <input type="email" data-type="email" defaultValue={this.props.customer.email} className="form-control" placeholder="Email" />
          </td>
          <td>
            <input type="tel" data-type="phone" defaultValue={this.props.customer.phone} className="form-control" placeholder="Telephone" />
          </td>
          <td>
            <input type="text" data-type="city" defaultValue={this.props.customer.city} className="form-control" placeholder="City" />
          </td>
          <td>
            <input type="text" data-type="address" defaultValue={this.props.customer.address} className="form-control" placeholder="Address" />
          </td>
          <td>
            <input type="text" data-type="state" defaultValue={this.props.customer.state} className="form-control" placeholder="State" />
          </td>
          <td>
            <input type="text" data-type="zip" defaultValue={this.props.customer.zip} className="form-control" placeholder="ZIP" />
          </td>
          <td>
            <div className="btn-group" role="group">
              <button onClick={() => this.toggleState(true)} className="btn btn-success">Save</button>
              <button onClick={() => this.toggleState(false)} className="btn btn-danger">Cancel</button>
            </div>
          </td>
        </tr>
      );
    }
    return (
      <tbody>
        {customer}
      </tbody>
    );
  }
});

var Modal = React.createClass({
  customerData: function() {
    var model = this.props.collectData(this.refs.modalForm, 'input');
    this.props.customerCreate(model);
  },
  render: function() {
    return (
      <div className="modal fade" id="add-customer" tabIndex={-1} role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
              <h4 className="modal-title">Add new customer</h4>
            </div>
            <div className="modal-body">
              <form ref="modalForm">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" data-type="name" autoComplete="name" className="form-control" placeholder="Name" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" data-type="email" inputMode="tel" autoComplete="email" className="form-control" placeholder="Email" />
                </div>
                <div className="form-group">
                  <label>Telephone</label>
                  <input type="tel" data-type="phone" className="form-control" placeholder="Telephone" />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input type="text" data-type="city" autoComplete="address-level1" className="form-control" placeholder="City" />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input type="text" data-type="address" autoComplete="street-address" className="form-control" placeholder="Address" />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input type="text" data-type="state" className="form-control" placeholder="State" />
                </div>
                <div className="form-group">
                  <label>ZIP</label>
                  <input type="text" data-type="zip" autoComplete="postal-code" className="form-control" placeholder="ZIP" />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              <button onClick={this.customerData} type="button" className="btn btn-primary" data-dismiss="modal">Create</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementsByClassName('app')[0]
);