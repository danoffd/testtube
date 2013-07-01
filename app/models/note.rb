class Note < ActiveRecord::Base
  attr_accessible :content, :notable_id, :notable_type
  belongs_to :notable, :polymorphic => true
end
