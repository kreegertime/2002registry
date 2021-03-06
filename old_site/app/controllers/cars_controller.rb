class CarsController < ApplicationController
  def new
    @car = Car.new
  end

  def create
    car = Car.create!(params[:car])
    flash[:notice] = "'#{car.vin}' a #{car.claimed_year} #{car.model.name} " +
                     "has been added to the registry."
    redirect_to current_user
  end

  def show
    @car = Car.find(params[:id])
  end

  def edit
    @car = Car.find(params[:id])
  end

  def index
    @cars = Car.all
  end

  def destroy
    car = Car.find(params[:id])
    if car.nil?
      flash[:notice] = "Could not delete the car from the registry. Please try again"
    else
      car.delete
      flash[:notice] = "'#{car.vin}' a #{car.claimed_year} #{car.model.name} " +
                       "has been deleted from the registry."
    end
    redirect_to user_path(current_user) 
  end

  def claim
    car = Car.find(params[:id])
    if car.nil?
      render :json => { :success => false }
    else
      new_user = User.find(params[:user_id])
      car.user = new_user
      if car.save
        render :json => { :success => true }
      else
        render :json => { :success => false }
      end
    end
  end
end
