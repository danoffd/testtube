class Project < ActiveRecord::Base
  attr_accessible :description, :name

  has_many :project_actors, :dependent => :destroy, :foreign_key => 'Project_id'
  has_many :project_models, :dependent => :destroy, :foreign_key => 'Project_id'

  validates :name, :uniqueness => {:message => "name must be unique"}
end
