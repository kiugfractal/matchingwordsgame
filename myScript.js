;(function($){


	//this function is to revert the position of the image box to its position
	function revertDraggable($selector){
		$selector.each(function(){
			var $this = $(this),
			
				taskSelector = $this.data('taskSelector');// to know what dropbox that this image box is currently onto 
				
				$this.draggable({
					disabled:false,
					revert:true
				});
			
				$this.animate({
					left:0,
					top:0
				},600,function(){ //return the dropbox to droppable state 
					$(taskSelector)	
						.droppable("enable");
					// console.log($(taskSelector).data('tagWord'));
				});
			
		});
	}

	//shuffle array function from 
	//reference: http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
	function shuffleArray(array){
		for (var i = array.length - 1;i>0;i--){
			var j = Math.floor(Math.random()*(i+1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}
	


	//the main part
	$(document).ready(function(){
		var listWords = [];
		var listPlay = [];
		var	position = [0,1,2,3];

		//initial the game 
		//first: shuffle the word lists
		//second: take 4 words 
		//third: render the images to the scence 
		//fourth: shuffle 4 an array position of 4 words to render the words box to the stage 
		function initGame(){

			//shuffle the list
			shuffleArray(listWords);

			//take 4 words from the list 
			listPlay = listWords.slice(0,5);
			console.log(listPlay);

			//Render images to the scene
			$('.imageBox').each(function(index){
				var $this = $(this);
				$this.data('tagWord',listPlay[index].word);

				$this.children('.avatar').css({
					'background-image':"url("+listPlay[index].image_url+")"
				});

			});

			//shuffle array position 
			shuffleArray(position);

			//render word scene 
			$('.wordBox header').each(function(index){
				$(this).siblings('.dropBox').data('tagWord',listPlay[position[index]].word) //tag word, for checking result
				$(this).html(listPlay[position[index]].word);
			})

		}


		// get data from json file 
		$.getJSON('ajax/mylist.json',function(data){
			listWords = data.listWords;
			initGame();
			
		})
		.success(function(){ console.log('second success');})
		.error(function(){ console.log('error');});

		//enable draggable for the image box
		$(".imageBox")
			.draggable({
				revert:true,
			});

		//add event listener to the drop box 
		$('#words div').each(function(index,element){
			var number=parseInt(index)+1;

			$('#word_'+number).droppable({
				drop:function(event,ui){
					
					ui.draggable.draggable({
						disabled:true,
						revert:false
					});

					ui.draggable.position({
						of:$(this),
						my:'left bottom',
						at:'left bottom'
					});
					
					ui.draggable.data('taskSelector',this); //bind this data to know which dropbox the image is on

					$(this).data('inputWord',ui.draggable.data('tagWord')); //this for checking result function 

					$(this)
						.droppable("option","disabled",true)
						.prev();
				}
			});			

		});

		//for the new game
		//move image blocks back to its positions
		//generate new images for new round 
		//clear the result div 
		$("#controller #newgame").on('click',function(){
			revertDraggable($('.imageBox'));
			$('#controller #result').html('')
			initGame();
		});


		//checking result event
		//compare inputWord and tagWord data from the .dropBox div  to calculate the point 
		$('#controller #check').on('click',function(){
			var point = 0;
			$('.dropBox').each(function(index){
				var $this =$(this);
				var input = $this.data('inputWord');
				var result = $this.data('tagWord');
				console.log(input+" "+result);
				if (input == result)
					point++;
				
			});

			if (point === 4 ){
				$('#controller #result').html('4/4 Correct! Congratulation!').animate({
					opacity:1
				},1000);
			}else{
				$('#controller #result').html(point+'/4 correct! Try again!').animate({
					opacity:1
				},1500,function(){
					$(this).animate({opacity:0},2000);
				});
			}
		});
		

		//for user to try again
		$('#controller #reset').on('click',function(){
			revertDraggable($('.imageBox'));
		});
		
	});



}(jQuery))