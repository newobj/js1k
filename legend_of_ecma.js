// P = player position
// Q = next player position
// H = canvas height (300)
// X = 20    
// A = Math.abs
// R = Math.random
// M = map 
// V = health 
// L = Levels (memoized)
// l = level
// I = parseInt
// T = tile image
// Tiles are horizontal offets (*8) in T
// 0 = tile - empty            0
// 1 = tile - stairs up        1
// 2 = tile - stairs down      2
// 3 = tile - monster          3
// 4 = tile - potion           4
// 5 = tile - heart            5
// 6 = tile - player           6
// 7 = tile - wall             7 
// 8 = tile - amulet of ecma   8
d=document   
c=d.body.children[0]
X=20
L={}
E=l=0
V=2 
M={}
I=parseInt
R=Math.random  
A=Math.abs
c.width=600
c.height=H=300
x=c.getContext('2d')
function Place(x){y=42+I(R()*X)*10+I(R()*6);M[y]=x}
function Level(w) {                                                                
  M={}            // Square boundary walls          // And 20 random interior walls
  for(i=0;++i<X;)Place(M[X+i]=M[280+i]=M[i*X]=M[i*X+19]=7)
  // Put potion (40% chance) or monster (60% chance)
  Place(R()<.4?4:3)
  // Place 'up' stairs only on 2nd level and lower
  !l?0:Place(1)
  // Place 'down' stairs until 20th floor, then place amulet
  Place(l<2?2:8)
  // Either look up the room from memory or use the one we just built
  M=L[l]=L[l]||M
  // Put player on up or down stairs if they're present, otherwise start at 255
  P=Locate(w)||84
}               
// Find the first position of a given tile
function Locate(tile){for(i in M)if(M[i]==tile)return+i}
// Draw the given tile at a given position, scaling to a ratio of 20:8 (eww)
function Draw(tile,pos){x.drawImage(T,tile*8,0,8,8,X*(pos%X),pos-pos%X,X,X)}
// Tick
function Tick(Q){        
  // I know it seems crazy to put this inside Tick, but it's the only way I could think of to delay binding this without spending any more bytes
  d.onkeyup=function(a){V&&Tick(P+({37:-1,39:1,38:-X,40:X}[a.keyCode]||0))}  
  // On FF, Q is something <= 0 when Tick is called via setTimeout.... ???
  Q=(Q>0?Q:(Level(1),P))
  // advance monster if there is one. if Locate returns nothign, assign m to H (out of bounds)
  M[m=Locate(3)||H]=0
  // figure out horizontal component of movement
  a=P%X-m%X
  a=a?a/A(a):0
  // figure out vertical component of movement
  b=I(P/X)-I(m/X)
  b=b?X*b/A(b):0
  // try diagonal then horizontal then vertical
  m+=M[m+a+b]?M[m+a]?M[m+b]?0:b:a:a+b
  // move the monster
  M[m]=3
  // If monster is now on our pre-move position, take damage and remove the monster
  M[P]==3?(V--,M[P]=0):0
  // Look at new position
  q=M[Q]      
  // Move us if the tile was not a wall 
  q==7?0:P=Q
  // If we hit a potion or amulet, take it and remove it
  a=(q==4?V++:q&8)
  a?M[Q]=0:0
  // If we hit stairs, move us up or down
  q==2?(l++,Level(1)):q==1?(l--,Level(2)):0
  // Blank out the background and draw our health.
  for(i=0;i<H;)Draw(i<V?5:0,i++)             
  // Draw the map
  for(i in M)Draw(M[i],i)
  // Draw the player
  Draw(V>0?6:3,P)                         
}
T=new Image;T.src='data:;base64,R0lGODlhSAAIAIAAAAAAAP///ywAAAAASAAIAAACXYyPqQmtfhw0DVAb8Mx4LdsxVchFXHWh42pm3ud+4NOB4xWjZx2/5kz6ITSp2862guh8LmBzyOrljMqkZkZhPp28HnIJvpaOWx+3XNtUhyJdFCt9oMte6AaWPbonBQA7'
Tick(0)
