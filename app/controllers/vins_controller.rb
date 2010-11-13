class VinsController < ApplicationController
  def show
    model = BMW2002VinTable.lookup_model(params[:id].to_i)[:model]
    if model.nil?
      render :json => { :success => false }
    else
      registered_car = Car.find_by_vin(params[:id].to_i)
      render :json => {
        :success => true,
        :is_registered => (registered_car.nil? ? false : true),
        :result => model,
      }
    end
  end
  
  def guess_year
    result = BMW2002VinTable.lookup_model(params[:id].to_i)
    if result[:model].nil?
      render :json => { :success => false }
    else
      start_year = result[:model].production_begin.year
      end_year = result[:model].production_end.year
      variance = result[:variance] * (end_year - start_year)
      render :json => { :success => true, :year => start_year + variance.round }
    end
  end
end
