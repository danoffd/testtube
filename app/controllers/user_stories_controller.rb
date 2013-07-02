class UserStoriesController < ApplicationController
  load_and_authorize_resource :project
  load_and_authorize_resource :user_story, :through => :project, :shallow => true

  # before_filter :find_project

  def show
  end
  
  def new
    # need the list of actors to include in the story
    # editor combo box
    @all_actors = get_actors

    @user_story = @project.user_stories.new
    @story_note = @user_story.notes.build

    if params[:parent].present?
      #requesting to add a child of a parent.  set the parent id to the specified
      #parent, and set the stack rank to the the lowest number (highest priority) minus 10
      @user_story.parent_user_story = @project.user_stories.find(params[:parent])
      oldest_child = @user_story.parent_user_story.child_user_stories.first()
      @user_story.stack_rank = oldest_child.nil? ? 10 : oldest_child.stack_rank - 10
    elsif params["after"].present?
      #requesting to add an element after another element.
      #set the parent to the parent of the requested sibling, and the stack rank to the 
      #siblings rank + 1
      bigbro = @project.user_stories.find(params[:after])
      @user_story.parent_user_story = bigbro.parent_user_story
      @user_story.stack_rank = (bigbro.stack_rank || 0)  + 1
    else
      #not sure where we are adding it. 
    end

    puts "*************creating new form: " + params.inspect
    respond_to do |format|
      format.html { render :nothing => true }
      format.js 
    end
  end

  def destroy

    @user_story_id = @user_story.id
    @user_story.delete

    respond_to do |format|
      format.html { render :nothing => true }
      format.js 
    end
  end

  def edit
    # need the list of actors to include in the story
    # editor combo box
    @all_actors = get_actors

    @user_story = @project.user_stories.find(params[:id])
    @story_note = @user_story.notes.build
  
    respond_to do |format|
      format.html { render :nothing => true }
      format.js 
    end
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

    @user_story = @project.user_stories.new

    puts "***********new user story: " + @user_story.inspect
  end

  def update
    puts "++++++ in update: " + params.inspect
    @user_story = @project.user_stories.find(params[:id])
    @special_action = params[:special_action]

    if @special_action == "parent_change"
      # for the parent change action, insert the story as the first child of the dropped story
      @new_parent_id = params[:new_parent]
      if @new_parent_id.nil?
        @user_story.parent_user_story = nil
        current_first_story = @project.user_stories.where("parent_user_story_id is null").first
      else
        @user_story.parent_user_story = @project.user_stories.find(@new_parent_id)
        current_first_story = @user_story.parent_user_story.child_user_stories.first()
      end
      puts "###########current first story: " + current_first_story.inspect
      @user_story.stack_rank = current_first_story.nil? ? 0 : current_first_story.stack_rank - 10
    elsif @special_action == "sibling_change"
      # for the sibling change action, insert the story after (in stack rank order) the big brother
      @new_bigbro_id = params[:new_bigbro]
      @bigbro_user_story = @project.user_stories.find(@new_bigbro_id)

      if !@bigbro_user_story.parent_user_story.nil?
        all_siblings = @bigbro_user_story.parent_user_story.child_user_stories
      else
        all_siblings = @project.user_stories.where("parent_user_story_id is null")
      end

      counter = 0

      puts "************* about to reorder: " + all_siblings.count.to_s
      puts "bigbro: " + @bigbro_user_story.id.to_s
      puts "moved: " + @user_story.id.to_s

      all_siblings.each do |s|
        puts "--" + s.id.to_s + "-" + s.want_to + " - current rank: " + s.stack_rank.to_s
        if @user_story.id != s.id
          counter += 10
          if s.stack_rank != counter
            puts "----- CHANGING!" + s.id.to_s + " ------ " + counter.to_s
            s.stack_rank = counter
            s.save!
          end
        end
        if s.id == @bigbro_user_story.id
          counter += 10
          puts "--  MOVED " + @user_story.id.to_s + @user_story.want_to + " ------ " + counter.to_s
          @user_story.stack_rank = counter
        end
      end
      
      @user_story.parent_user_story = @bigbro_user_story.parent_user_story
    else
      # just an update from the story editor
      @user_story.want_to = params[:user_story][:want_to]
      @user_story.so_i_can = params[:user_story][:so_i_can]
      @user_story.is_estimate_final = false
      @user_story.actor = find_or_create_actor(params[:user_story][:actor_name])
      
      valid_notes = params[:user_story][:notes_attributes].select { |k, itm| !itm[:content].blank? }
      @user_story.notes_attributes = valid_notes
    end
   
    puts "+++++++inspect: " + @user_story.inspect

    @user_story.save!

    puts "++++++ saved"

    respond_to do |format|
      format.html { render :nothing => true }
      format.js 
    end
  end

  def create
    puts "++++++ in create"
    story_type = StoryType.where(:story_type_name => "Development").first
    puts "++++++ gonna save: " + params.inspect
   
    @user_story = @project.user_stories.new(params[:user_story])
    @user_story.priority = 5
    @user_story.story_type = story_type
    @user_story.is_fully_recorded = false
    @user_story.is_estimate_final = false
    @user_story.actor = find_or_create_actor(params[:user_story][:actor_name])
   
    puts @user_story.inspect

    @user_story.save!

    puts "++++++ saved"

    respond_to do |format|
      format.html { render :nothing => true }
      format.js 
    end
  end

  def find_or_create_actor(actor_name)
    actor = Actor.where(:actor_singular_name => actor_name, :project_id => @project.id).first
    if actor.nil?
      actor = @project.actors.create!(\
        :actor_singular_name => actor_name, \
        :actor_plural_name => actor_name.pluralize(2), \
        :use_an_instead_of_a => false)
    end
    puts "++++++ Actor:" + actor.inspect
    actor
  end

  def get_root_user_stories
    UserStory.where("parent_user_story_id is NULL and project_id = ?", @project.id)
  end

  def build_drawers
    retval = []

    retval.push({\
      :partial_name => "drawer_project_notes"\
      , :drawer_header => "Project Notes"\
      , :handle_text => "notes"\
    })

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
    if @project.nil?
      @project = Project.find(@user_story.project_id)
    end
    @project.actors
  end

end
