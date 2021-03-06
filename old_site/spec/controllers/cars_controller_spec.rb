require "spec_helper"

describe CarsController do

  describe "GET new" do
    it "should route" do
      { :get => "/cars/new"}.should route_to(
        :controller => "cars", :action => "new")
    end

    it "should work" do
      get :new
      response.should be_success
    end
  end

  describe "POST create" do
    it "should create a car object with the params passed in" do
      # XXXkreeger Add stuff for images?
      mock_car = mock_model(Car,
                            :user_id => 1,
                            :vin => 2364177,
                            :model_id => 1,
                            :claimed_year => 1975,
                            :color => "Polaris",
                            :is_alive => true,
                            :location_country_code => "US",
                            :location_state => "CA")
      mock_user = mock_model(User, :email => "test@user.org", :password => "foobar")

      Car.should_receive(:create!).and_return(mock_car)
      mock_car.should_receive(:model).and_return(mock_model(Model, :name => "Mock Model"))
      controller.stub!(:current_user).and_return(mock_user)

      post :create, {
        :car => {
          :user_id => mock_car.user_id,
          :vin => mock_car.vin,
          :model_id => mock_car.model_id,
          :claimed_year => mock_car.claimed_year,
          :color => mock_car.color,
          :is_alive => mock_car.is_alive,
          :location_country_code => mock_car.location_country_code,
          :location_state => mock_car.location_state
        }
      }
      response.should redirect_to(user_path(mock_user.id))
    end
  end

  describe "GET show" do
    it "should load information for the car if it exists" do
      car = mock_model(Car, :id => 1,
                            :user_id => 1,
                            :vin => 234177,
                            :claimed_year => 1975,
                            :color => "Polaris",
                            :is_alive => true,
                            :location_country_code => "US",
                            :location_state => "MO")
      Car.should_receive(:find).with("1").and_return(car)
    
      get :show, :id => "1"
      assigns(:car).vin.should == 234177
      assigns(:car).color.should == "Polaris"
      assigns(:car).is_alive.should be_true
    end
  end

  describe "GET index" do
    it "Should load all of the registered cars for now" do
      Car.should_receive(:all).and_return([mock_model(Car), mock_model(Car)])
      get :index
      assigns(:cars).length.should == 2
    end
  end

  describe "POST claim_car" do
    it "Should update the user_id for the claimed car." do
      mock_user1 = mock_model(User, :name => "Old Owner")
      mock_user2 = mock_model(User, :name => "New Owner")
      mock_car = mock(:vin => 2364177, :user => mock_user1)

      Car.should_receive(:find).with("1").and_return(mock_car)
      User.should_receive(:find).with("2").and_return(mock_user2)
      mock_car.should_receive(:user=).with(mock_user2)
      mock_car.should_receive(:save).and_return(true)

      post :claim, :id => "1", :user_id => "2"
      response.should be_success
      json_response = ActiveSupport::JSON.decode(response.body.as_json)
      json_response["success"].should be_true
    end

    it "Should return false if the VIN hasn't already been registered" do
      Car.should_receive(:find).with("1").and_return(nil)

      post :claim, :id => "1", :user_id => "2"
      response.should be_success
      json_response = ActiveSupport::JSON.decode(response.body.as_json)
      json_response["success"].should be_false
    end
  end

  describe "DELETE destroy" do
    it "should delete a car when prompted" do
      car = mock_model(Car, :id => 1,
                            :user_id => 1,
                            :vin => 234177,
                            :claimed_year => 1975,
                            :color => "Polaris",
                            :is_alive => true,
                            :location_country_code => "US",
                            :location_state => "MO")
      Car.should_receive(:find).with("1").and_return(car)
      car.should_receive(:delete).and_return(true)
      delete :destroy, :id => "1"
    end
  end

end
