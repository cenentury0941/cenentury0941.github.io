extends KinematicBody


# Declare member variables here. Examples:
# var a = 2
# var b = "text"


# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


var speed = 6900
var velocity = Vector3()

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	
	velocity = Vector3()
	
	if Input.is_action_pressed("ui_up"):
		velocity.z -= 1
		
	if Input.is_action_pressed("ui_down"):
		velocity.z += 1
		
	if Input.is_action_pressed("ui_left"):
		velocity.x -= 1
		
	if Input.is_action_pressed("ui_right"):
		velocity.x += 1
		
#	print( "Input : " , velocity * speed * delta , delta )
	
	move_and_slide( velocity.normalized() * speed * delta )
