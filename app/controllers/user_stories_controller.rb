class UserStoriesController < ApplicationController

  before_filter :find_project

  def show
  end

  def index
    # identify which drawers should be in the chest
    @slider_drawers = build_drawers

    # need the list of actors to include in the story
    # editor combo box
    @all_actors = get_actors


    # fetch the root user stories from the DB that are the roots
    # They will contain the rest of the stories recursively
    @root_user_stories = get_root_user_stories

    @dummy_story = UserStory.new
  end

  def save

    puts "++++++ in save"
    story_type = StoryType.where(:story_type_name => "Development").first
    actor = Actor.where(:actor_singular_name => "Doer").first
    puts "++++++ gonna save: " + params[:user_story][:want_to]
    puts params.inspect

   
    if params[:user_story][:id] == "new"
      @story = UserStory.new(params[:user_story])
    
      
      @story.priority = 5
      @story.Actor_id = actor.id
      @story.StoryType_id = story_type.id
      @story.Project_id = @project.id
    else
      @story = UserStory.find(params[:user_story][:id])
      @story.want_to = params[:user_story][:want_to]
      @story.so_i_can = params[:user_story][:so_i_can]
    end

    @story.is_fully_recorded = false
    @story.is_estimate_final = false
   
    puts @story.inspect

    @story.save!

    puts "++++++ saved"

    render :nothing => true
  end

  def create
  end

  def get_root_user_stories
    UserStory.where("parent_user_story_id is NULL and project_id = ?", @project.id)
  end

  def build_drawers
    retval = []

    retval.push({\
      :partial_name => "drawer_filters"\
      , :drawer_header => "Filters"\
      , :handle_text => "filters"\
    })

    retval.push({\
      :partial_name => "drawer_assign_to_buckets"\
      , :drawer_header => "Work Buckets"\
      , :handle_text => "buckets"\
    })

    retval.push({\
      :partial_name => "drawer_cheat_sheet"\
      , :drawer_header => "Cheat Sheet"\
      , :handle_text => "cheat"\
    })

    return retval
  end

  def get_actors
    return Actor.all
  end

  def find_project
    if params[:project_id]
      @project = Project.find_by_id(params[:project_id])
      puts "*********  found project"
    end
  end
end
