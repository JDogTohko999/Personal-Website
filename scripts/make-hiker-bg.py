# How public/bg3 was made. The reference (redesign-refs/bg-hiker-ridge.jpg, 646x431) is a mirrored, colour-graded
# crop of ~/Downloads/NOLS_I_THINK_I_CAN.JPG (2620x1738). This learns that grade (sky and ground separately) from the
# matching native crop, then applies it to a wider 1310x873 crop and a 760x1140 portrait crop of the mirrored original.
# Originals are never modified. Resized/upscaled copies were then written with PIL (LANCZOS).
import numpy as np
from PIL import Image, ImageOps
SC=r"C:\Users\jdog1\AppData\Local\Temp\claude\87864d7a37685f71\74d92bcd-63a6-4546-b421-d9be552503c0\scratchpad"
ref=np.asarray(Image.open(r"C:\Users\jdog1\OneDrive\Documents\Personal Projects\Personal Website\redesign-refs\bg-hiker-ridge.jpg").convert('RGB'),dtype=np.float32)
orig=ImageOps.mirror(Image.open(r"C:\Users\jdog1\Downloads\NOLS_I_THINK_I_CAN.JPG").convert('RGB'))
# the matched native crop, used to learn the grade (src -> ref) per channel, split sky/ground by luminance
src_c=np.asarray(orig.crop((1921,459,1921+655,459+437)).resize((646,431)),dtype=np.float32)
def fit(a,b):  # per-channel affine a->b
    return [(b[...,i].std()/(a[...,i].std()+1e-6), b[...,i].mean(), a[...,i].mean()) for i in range(3)]
def apply(img,params):
    out=img.copy()
    for i,(k,mb,ma) in enumerate(params): out[...,i]=(img[...,i]-ma)*k+mb
    return np.clip(out,0,255)
# separate params for sky (top 60%) and ground (bottom 20%) to keep scree olive, sky teal
sky=fit(src_c[:240],ref[:240]); gnd=fit(src_c[360:],ref[360:])
def grade(img):
    a=np.asarray(img,dtype=np.float32); h=a.shape[0]
    s=apply(a,sky); g=apply(a,gnd)
    # blend by a vertical mask derived from luminance (sky bright/blue vs ground)
    lum=a.mean(axis=2); m=np.clip((lum-90)/60,0,1)[...,None]  # 1=sky-ish
    return Image.fromarray((s*m+g*(1-m)).astype(np.uint8))
# check the grade reproduces the ref on the native crop
grade(Image.fromarray(src_c.astype(np.uint8))).save(SC+r"\grade_check.jpg",quality=90)
# wide hi-res crop: right part of mirrored original, ridge low
W=1310; x0=2620-W; y0=150; crop=orig.crop((x0,y0,x0+W,y0+int(W*2/3)))
g=grade(crop); g.save(SC+r"\wide_graded.jpg",quality=90); print(crop.size)
# portrait crop for phones: hiker ~55% across, ridge in lower third
tall=orig.crop((1660,0,1660+760,1140)); grade(tall).save(SC+r"\tall_graded.jpg",quality=90); print(tall.size)
